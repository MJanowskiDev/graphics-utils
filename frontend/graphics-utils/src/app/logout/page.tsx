import { LogoutView } from '@/features/auth/components';

export default function LoginPage() {
  return (
    <section>
      <div className="flex flex-col gap-6">
        <h1 className="text-2xl">Logged out successfully</h1>
        <LogoutView />
      </div>
    </section>
  );
}
