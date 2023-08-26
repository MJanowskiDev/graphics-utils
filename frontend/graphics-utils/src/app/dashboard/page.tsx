import { InitPasswordResetView } from '@/features/auth/components';
import Link from 'next/link';

export default function InitPasswordResetPage() {
  return (
    <section className="flex flex-col gap-6 w-full items-center justify-center">
      <div className="flex flex-col gap-6 w-[300px]">
        <h1 className="text-2xl">Dashboard</h1>
        <Link className="rounded-lg bg-purple-600 text-white text-md p-2.5" href="/grayscale">
          To grayscale
        </Link>

        <Link className="rounded-lg bg-purple-600 text-white text-md p-2.5" href="/bgremoval">
          Remove background
        </Link>
      </div>
    </section>
  );
}
