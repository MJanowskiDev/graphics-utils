import { ActivateView } from '@/features/auth/components';

export default function ActivatePage() {
  return (
    <section className="flex flex-col gap-6 w-full items-center justify-center">
      <div className="flex flex-col gap-6">
        <ActivateView />
      </div>
    </section>
  );
}
