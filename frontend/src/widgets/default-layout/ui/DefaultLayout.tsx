import { Header } from '@/shared/ui/header';
import { Outlet } from 'react-router';

const DefaultLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header.Default />
      <main className="flex-1 flex flex-col items-center justify-center">
        <Outlet />
      </main>
    </div>
  );
};

DefaultLayout.displayName = 'DefaultLayout';

export { DefaultLayout };
