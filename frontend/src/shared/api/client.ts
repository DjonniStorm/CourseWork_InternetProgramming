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

  private async requestWithAuth<T>(
    url: string,
    options: RequestInit,
    retry = true
  ): Promise<T> {
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
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
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
