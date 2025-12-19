import { ProfilePage } from '@/pages/profile';
import { AppLayout } from '@/widgets/app-layout';
import { DefaultLayout } from '@/widgets/default-layout';
import { ProtectedRoute } from '@/shared/ui/ProtectedRoute';
import { PublicRoute } from '@/shared/ui/PublicRoute';
import { lazy } from 'react';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router';

const LoginPage = lazy(() =>
  import('@pages/auth/login').then((module) => ({ default: module.LoginPage })),
);

const RegisterPage = lazy(() =>
  import('@pages/auth/register').then((module) => ({ default: module.RegisterPage })),
);

const InvintationsPage = lazy(() =>
  import('@pages/invintations').then((module) => ({ default: module.InvintationsPage })),
);

const EventsPage = lazy(() =>
  import('@pages/events').then((module) => ({ default: module.EventsPage })),
);
const EventPage = lazy(() =>
  import('@pages/events').then((module) => ({ default: module.EventPage })),
);

const ContactsPage = lazy(() =>
  import('@pages/contacts').then((module) => ({ default: module.ContactsPage })),
);

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: '/',
        element: <Navigate to="/profile" replace />,
      },
      {
        path: '/profile',
        element: <ProfilePage />,
      },
      {
        path: '/invitations',
        element: <InvintationsPage />,
      },
      {
        path: '/events',
        element: <EventsPage />,
      },
      {
        path: '/events/:id',
        element: <EventPage />,
      },
      {
        path: '/contacts',
        element: <ContactsPage />,
      },
    ],
  },
  {
    path: '/login',
    element: (
      <PublicRoute>
        <DefaultLayout />
      </PublicRoute>
    ),
    children: [
      {
        index: true,
        element: <LoginPage />,
      },
    ],
  },
  {
    path: '/register',
    element: (
      <PublicRoute>
        <DefaultLayout />
      </PublicRoute>
    ),
    children: [
      {
        index: true,
        element: <RegisterPage />,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/login" replace />,
  },
]);

const Router = () => {
  return <RouterProvider router={router} />;
};

Router.displayName = 'RouterProvider';

export { Router };
