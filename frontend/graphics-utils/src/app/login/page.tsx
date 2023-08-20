import { LoginView } from '@/features/auth/components';

export default function LoginPage() {
  return (
    <section>
      <div className="flex flex-col gap-6">
        <h1 className="text-2xl">Login</h1>
        <LoginView />
      </div>
    </section>
  );
}
