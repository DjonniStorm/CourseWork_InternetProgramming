import { useHead } from '@unhead/react';

const ProfilePage = () => {
  useHead({
    title: 'Профиль',
  });

  return <div>ProfilePage</div>;
};

ProfilePage.displayName = 'ProfilePage';

export { ProfilePage };
