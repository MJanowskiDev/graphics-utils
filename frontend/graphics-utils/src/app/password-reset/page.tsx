import { PasswordResetView } from '@/features/auth/components';

export default function PasswordResetPage() {
  return (
    <section>
      <div className="flex flex-col gap-6">
        <h1 className="text-2xl">Password Reset</h1>
        <PasswordResetView />
      </div>
    </section>
  );
}
