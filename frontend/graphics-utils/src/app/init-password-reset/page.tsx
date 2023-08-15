import { InitPasswordResetView } from '@/features/auth/components';

export default function InitPasswordResetPage() {
  return (
    <section>
      <div className="flex flex-col gap-6">
        <h1 className="text-2xl">Initialize password reset</h1>
        <InitPasswordResetView />
      </div>
    </section>
  );
}
