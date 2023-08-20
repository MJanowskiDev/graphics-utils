import { RegisterView } from '@/features/auth/components';

export default function RegisterPage() {
  return (
    <section>
      <div className="flex flex-col gap-6">
        <h1 className="text-2xl">Create account</h1>
        <RegisterView />
      </div>
    </section>
  );
}
