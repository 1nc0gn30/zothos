import { Show, UserProfile } from '@clerk/nextjs';
import { setRequestLocale } from 'next-intl/server';
import { getI18nPath } from '@/utils/Helpers';

export default async function UserProfilePage(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  return (
    <div className="my-6 lg:-ml-12">
      <Show when="signed-in">
        <UserProfile path={getI18nPath('/dashboard/user-profile', locale)} />
      </Show>
    </div>
  );
}
