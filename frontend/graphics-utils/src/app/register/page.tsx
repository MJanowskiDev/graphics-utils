import { RegisterView } from '@/features/auth/components';

export default function RegisterPage() {
  return (
    <section className="flex flex-col gap-6 w-full items-center justify-center">
      <div className="flex flex-col gap-6 w-[300px]">
        <h1 className="text-2xl">Create account</h1>
        <RegisterView />
      </div>
    </section>
  );
}
