import Link from 'next/link';

import { DriveImportButton } from '@/components/DriveImportButton';
import { OnboardingSlideshow } from '@/components/onboarding/OnboardingSlideshow';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 text-center">
      <OnboardingSlideshow />
      <h1 className="text-4xl font-bold tracking-tight text-primary-200 sm:text-6xl mb-4">
        MapleLeaf <span className="text-primary-500">Resume</span>
      </h1>
      <p className="text-lg text-slate-400 max-w-2xl mb-8">
        The privacy-focused, AI-powered resume builder for Canadian professionals.
      </p>

      <div className="flex gap-4">
        <Link href="/wizard">
          <button className="px-6 py-3 rounded-xl bg-primary-600 text-white font-semibold shadow-lg shadow-primary-500/30 hover:bg-primary-500 transition-all">
            Create My Profile
          </button>
        </Link>
        <DriveImportButton />
      </div>
    </main>
  );
}
