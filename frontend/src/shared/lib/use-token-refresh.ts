import { useEffect } from 'react';
import { startTokenRefresh, stopTokenRefresh } from './token-refresh';
import { useRefresh } from '@/entities/user';

export const useTokenRefresh = () => {
  const { mutateAsync: refresh } = useRefresh();

  useEffect(() => {
    const refreshFn = async () => {
      await refresh();
    };

    startTokenRefresh(refreshFn);

    return () => {
      stopTokenRefresh();
    };
  }, [refresh]);
};


