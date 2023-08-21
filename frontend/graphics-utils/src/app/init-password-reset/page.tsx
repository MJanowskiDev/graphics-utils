import { InitPasswordResetView } from '@/features/auth/components';

export default function InitPasswordResetPage() {
  return (
    <section className="flex flex-col gap-6 w-full items-center justify-center">
      <div className="flex flex-col gap-6 w-[300px]">
        <h1 className="text-2xl">Password reset</h1>
        <InitPasswordResetView />
      </div>
    </section>
  );
}
