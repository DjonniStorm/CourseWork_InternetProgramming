import { Navigate } from 'react-router';
import { useMe, useRefresh } from '@/entities/user';
import { tokenStorage } from '@/shared/lib/token';
import { Loader, Center } from '@mantine/core';
import { useEffect, useState, type PropsWithChildren } from 'react';

export const ProtectedRoute = ({ children }: PropsWithChildren) => {
  const hasToken = tokenStorage.has();
  const { data: user, isLoading, isError } = useMe();
  const { mutateAsync: refresh } = useRefresh();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // При загрузке проверяем, есть ли refresh token в cookie
  // Если есть, но нет access token - пытаемся обновить
  useEffect(() => {
    const checkAndRefreshToken = async () => {
      if (!hasToken && !isRefreshing) {
        setIsRefreshing(true);
        try {
          await refresh();
        } catch (error: unknown) {
          console.debug('No valid refresh token', error);
        } finally {
          setIsRefreshing(false);
        }
      }
    };

    checkAndRefreshToken();
  }, [hasToken, isRefreshing, refresh]);

  // Если нет токена и не обновляем, редиректим
  if (!hasToken && !isRefreshing) {
    return <Navigate to="/login" replace />;
  }

  // Пока проверяем авторизацию или обновляем токен, показываем loader
  if (isLoading || isRefreshing) {
    return (
      <Center h="100vh">
        <Loader size="lg" />
      </Center>
    );
  }

  // Если ошибка авторизации (401), редиректим на логин
  if (isError || !user) {
    tokenStorage.remove();
    return <Navigate to="/login" replace />;
  }

  // Если авторизован, показываем контент
  return <>{children}</>;
};
