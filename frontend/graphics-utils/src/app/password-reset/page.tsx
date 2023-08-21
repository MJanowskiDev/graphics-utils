import { PasswordResetView } from '@/features/auth/components';

export default function PasswordResetPage() {
  return (
    <section className="flex flex-col gap-6 w-full items-center justify-center">
      <div className="flex flex-col gap-6 w-[300px]">
        <h1 className="text-2xl">Setting new password</h1>
        <PasswordResetView />
      </div>
    </section>
  );
}
