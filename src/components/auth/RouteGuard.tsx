'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { db } from '@/lib/db';
import { Loader2 } from 'lucide-react';

export function RouteGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        const checkAccess = async () => {
            setIsLoading(true);
            try {
                // 1. Check if Profile exists (Global Check for all protected routes)
                const profileCount = await db.user_profile.count();

                if (profileCount === 0) {
                    // No profile found, redirect to Home to start Wizard
                    console.log('RouteGuard: No profile found, redirecting to home');
                    router.replace('/');
                    return;
                }

                // 2. Check Resume specific routes
                if (pathname?.includes('/resumes/')) {
                    // Extract resume ID from path if needed, but for now just check if ANY resume exists
                    // Or specifically if the resume ID exists.
                    // For simply "viewing" a resume, we should check if it exists.
                    // If pathname is /dashboard/resumes/[id], we might want to check that specific ID.
                    // But the requirement was: "if I haven't created a resume I shouldn't be able to load any related URL"

                    const resumeCount = await db.resumes.count();
                    if (resumeCount === 0) {
                        console.log('RouteGuard: No resumes found, redirecting to dashboard');
                        router.replace('/dashboard');
                        return;
                    }
                }

                setIsAuthorized(true);
            } catch (error) {
                console.error('RouteGuard Error:', error);
                // Fallback to safe route or show error
                router.replace('/');
            } finally {
                setIsLoading(false);
            }
        };

        // Run check on mount and path change
        checkAccess();
    }, [pathname, router]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-950">
                <div className="text-center space-y-4">
                    <Loader2 className="w-10 h-10 text-emerald-500 animate-spin mx-auto" />
                    <p className="text-emerald-400 font-medium">Verifying access...</p>
                </div>
            </div>
        );
    }

    // Only render children if authorized to prevent flash of content
    return isAuthorized ? <>{children}</> : null;
}
