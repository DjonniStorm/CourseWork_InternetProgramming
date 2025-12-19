import { StrictMode, type ErrorInfo } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { Theme } from './app/providers/Theme.tsx';
import { Router } from './app/providers/Router.tsx';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './shared/config';
import { createHead, UnheadProvider } from '@unhead/react/client';

const head = createHead();

createRoot(document.getElementById('root')!, {
  onCaughtError: (error: unknown, errorInfo: ErrorInfo) => {
    if (error instanceof Error && error.message !== 'Known error') {
      console.error('Caught error');
      console.error(error);
      console.error(errorInfo);
    }
  },
  onUncaughtError(error, errorInfo) {
    if (error instanceof Error && error.message !== 'Known error') {
      console.error('Uncaught error');
      console.error(error);
      console.error(errorInfo);
    }
  },
}).render(
  <StrictMode>
    <UnheadProvider head={head}>
      <Theme>
        <QueryClientProvider client={queryClient}>
          <Router />
        </QueryClientProvider>
      </Theme>
    </UnheadProvider>
  </StrictMode>,
);
