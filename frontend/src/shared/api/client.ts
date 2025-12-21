import { API_URL } from '@/shared/config';
import { tokenStorage } from '@/shared/lib/token';

class ApiClient {
  private isRefreshing = false;
  private refreshPromise: Promise<string> | null = null;

  public constructor(private readonly baseUrl: string) {}

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    const token = tokenStorage.get();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  private async refreshToken(): Promise<string> {
    if (this.isRefreshing && this.refreshPromise) {
      return this.refreshPromise;
    }

    this.isRefreshing = true;
    this.refreshPromise = fetch(`${this.baseUrl}/api/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })
      .then(async (response) => {
        if (!response.ok) {
          tokenStorage.remove();
          throw new Error('Failed to refresh token');
        }
        const data = await response.json();
        if (data.accessToken) {
          tokenStorage.set(data.accessToken);
          return data.accessToken;
        }
        throw new Error('No access token in refresh response');
      })
      .catch((error) => {
        tokenStorage.remove();
        throw error;
      })
      .finally(() => {
        this.isRefreshing = false;
        this.refreshPromise = null;
      });

    return this.refreshPromise;
  }

  private async requestWithAuth<T>(url: string, options: RequestInit, retry = true): Promise<T> {
    const response = await fetch(`${this.baseUrl}${url}`, {
      ...options,
      headers: this.getHeaders(),
      credentials: 'include',
    });

    if (response.status === 401 && retry) {
      try {
        await this.refreshToken();
        return this.requestWithAuth<T>(url, options, false);
      } catch (error) {
        tokenStorage.remove();
        throw error;
      }
    }

    if (!response.ok) {
      const error = new Error(`HTTP error! status: ${response.status}`);
      (error as Error & { status: number }).status = response.status;
      throw error;
    }

    // Статусы без тела ответа (204 No Content, 205 Reset Content и т.д.)
    if (response.status === 204 || response.status === 205) {
      return null as T;
    }

    // Проверяем наличие контента перед парсингом JSON
    const contentType = response.headers.get('content-type');
    const contentLength = response.headers.get('content-length');

    if (!contentType?.includes('application/json') || contentLength === '0') {
      return null as T;
    }

    // Пытаемся получить текст, чтобы проверить, не пустой ли ответ
    const text = await response.text();
    if (!text || text.trim() === '') {
      return null as T;
    }

    try {
      return JSON.parse(text) as T;
    } catch {
      // Если не удалось распарсить JSON, возвращаем null
      return null as T;
    }
  }

  public async get<T>(url: string): Promise<T> {
    return this.requestWithAuth<T>(url, {
      method: 'GET',
    });
  }

  public async post<T>(url: string, data: unknown): Promise<T> {
    return this.requestWithAuth<T>(url, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  public async put<T>(url: string, data: unknown): Promise<T> {
    return this.requestWithAuth<T>(url, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  public async delete<T>(url: string): Promise<T> {
    return this.requestWithAuth<T>(url, {
      method: 'DELETE',
    });
  }
}

export const apiClient = new ApiClient(API_URL);
