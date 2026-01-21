'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { db, PROFILE_ID, resetProfile } from '@/lib/db';
import { DriveImportButton } from '@/components/DriveImportButton';
import { OnboardingSlideshow } from '@/components/onboarding/OnboardingSlideshow';
import { NorthernButton } from '@/components/ui/NorthernButton';

export default function Home() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkProfile = async () => {
      try {
        const profile = await db.user_profile.get(PROFILE_ID);
        // Check if profile exists and has some data indicating the wizard was used
        // We check standard fields like fullName or if there is any experience added.
        // Just having the record (initProfile) might not be enough if it's empty.
        const hasData = profile && (
          profile.contact.fullName.trim().length > 0 ||
          profile.experience.length > 0 ||
          profile.education.length > 0
        );

        if (hasData) {
          router.push('/dashboard');
        } else {
          setIsChecking(false);
        }
      } catch (error) {
        console.error("Error checking profile:", error);
        setIsChecking(false);
      }
    };

    checkProfile();
  }, [router]);

  const handleCreateProfile = async () => {
    await resetProfile();
    router.push('/app/wizard'); // Wait, check route. It was /wizard in previous view.
    // Let's verify the route. The wizard page was at src/app/wizard/page.tsx.
    // So route is /wizard.
    router.push('/wizard');
  };

  if (isChecking) {
    return (
      <main className="flex min-h-screen items-center justify-center p-24 text-center bg-slate-950">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-8 bg-primary-500 rounded-full mb-4 animate-bounce"></div>
          <p className="text-slate-400">Loading...</p>
        </div>
      </main>
    );
  }

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
        <NorthernButton
          onClick={handleCreateProfile}
          className="px-6 py-6 text-lg rounded-xl bg-primary-600 text-white font-semibold shadow-lg shadow-primary-500/30 hover:bg-primary-500 transition-all border-none"
        >
          Create My Profile
        </NorthernButton>
        <DriveImportButton />
      </div>
    </main>
  );
}
