import { LogoutView } from '@/features/auth/components';

export default function LoginPage() {
  return (
    <section className="flex flex-col gap-6 w-full items-center justify-center">
      <div className="flex flex-col gap-6">
        <LogoutView />
      </div>
    </section>
  );
}
