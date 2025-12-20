import { tokenStorage } from './token';

const TOKEN_CHECK_INTERVAL = 14 * 60 * 1000; // 14 минут (токен живет 15 минут)

let refreshIntervalId: number | null = null;

const decodeToken = (token: string): { exp?: number } | null => {
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload));
    return decoded;
  } catch {
    return null;
  }
};

const isTokenExpiringSoon = (token: string): boolean => {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return true;

  const expirationTime = decoded.exp * 1000; // конвертируем в миллисекунды
  const now = Date.now();
  const timeUntilExpiration = expirationTime - now;

  // Обновляем если до истечения осталось меньше 2 минут
  return timeUntilExpiration < 2 * 60 * 1000;
};

export const startTokenRefresh = (refreshFn: () => Promise<void>) => {
  if (refreshIntervalId) {
    clearInterval(refreshIntervalId);
  }

  const checkAndRefresh = async () => {
    const token = tokenStorage.get();
    if (!token) {
      stopTokenRefresh();
      return;
    }

    if (isTokenExpiringSoon(token)) {
      try {
        await refreshFn();
      } catch (error) {
        console.error('Failed to refresh token:', error);
        tokenStorage.remove();
        stopTokenRefresh();
      }
    }
  };

  // Проверяем сразу при старте
  checkAndRefresh();

  // Затем проверяем каждые 14 минут
  refreshIntervalId = setInterval(checkAndRefresh, TOKEN_CHECK_INTERVAL);
};

export const stopTokenRefresh = () => {
  if (refreshIntervalId) {
    clearInterval(refreshIntervalId);
    refreshIntervalId = null;
  }
};
