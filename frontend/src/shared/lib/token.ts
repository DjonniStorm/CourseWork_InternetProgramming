const ACCESS_TOKEN_KEY = 'accessToken';

class TokenStorage {
  constructor(private readonly storageKey: string) {}

  get(): string | null {
    if (typeof window === 'undefined') {
      return null;
    }
    return localStorage.getItem(this.storageKey);
  }

  set(token: string): void {
    if (typeof window === 'undefined') {
      return;
    }
    localStorage.setItem(this.storageKey, token);
  }

  remove(): void {
    if (typeof window === 'undefined') {
      return;
    }
    localStorage.removeItem(this.storageKey);
  }

  has(): boolean {
    return this.get() !== null;
  }
}

export const tokenStorage = new TokenStorage(ACCESS_TOKEN_KEY);
