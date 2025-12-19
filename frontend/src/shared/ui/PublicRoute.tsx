import { Navigate } from 'react-router';
import { useMe } from '@/entities/user';
import { tokenStorage } from '@/shared/lib/token';
import type { PropsWithChildren } from 'react';

export const PublicRoute = ({ children }: PropsWithChildren) => {
  const hasToken = tokenStorage.has();
  const { data: user, isLoading } = useMe();

  if (hasToken && user && !isLoading) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
