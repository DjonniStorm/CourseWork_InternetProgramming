import { ProfilePage } from '@/pages/profile';
import { AppLayout } from '@/widgets/app-layout';
import { lazy } from 'react';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router';

const LoginPage = lazy(() =>
  import('@pages/auth/login').then((module) => ({ default: module.LoginPage })),
);

const RegisterPage = lazy(() =>
  import('@pages/auth/register').then((module) => ({ default: module.RegisterPage })),
);

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        path: '/',
        element: <Navigate to="/profile" />,
      },
      {
        path: '/profile',
        element: <ProfilePage />,
      },
    ],
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '*',
    element: <Navigate to="/login" />,
  },
]);

const Router = () => {
  return <RouterProvider router={router} />;
};

Router.displayName = 'RouterProvider';

export { Router };
