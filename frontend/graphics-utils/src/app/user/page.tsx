'use client';

import { PasswordChangeView } from '@/features/auth/components';
import { withAuth } from '@/shared/hoc';

function UserProfilePage() {
  return (
    <section className="flex flex-col gap-6 w-full items-center justify-center">
      <div className="flex flex-col gap-6 w-[300px]">
        <h1 className="text-2xl">Profile settings</h1>
        <h1 className="text-xl">Password change</h1>
        <PasswordChangeView />
      </div>
    </section>
  );
}

export default withAuth(UserProfilePage);
