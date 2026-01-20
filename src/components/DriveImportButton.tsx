'use client';

import { useGoogleLogin } from '@react-oauth/google';
import { NorthernButton } from '@/components/ui/NorthernButton';
import { DriveService } from '@/lib/google-drive';
import { db } from '@/lib/db';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function DriveImportButton() {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const login = useGoogleLogin({
        scope: 'https://www.googleapis.com/auth/drive.appdata',
        onSuccess: async (tokenResponse) => {
            setIsLoading(true);
            try {
                const driveService = new DriveService(tokenResponse.access_token);
                // Load profile from Drive
                const profileData = await driveService.loadProfile();

                if (profileData) {
                    // Update local DB
                    await db.user_profile.put(profileData);
                    // Redirect to dashboard
                    router.push('/dashboard');
                } else {
                    alert('No profile found in your Google Drive Application Data folder.');
                }
            } catch (error) {
                console.error('Failed to import from Drive:', error);
                alert('Failed to import from Drive. See console for details.');
            } finally {
                setIsLoading(false);
            }
        },
        onError: () => {
            alert('Google Login Failed');
        }
    });

    return (
        <NorthernButton
            variant="secondary"
            onClick={() => login()}
            isLoading={isLoading}
            className="bg-white/10 text-slate-200 border-white/20 hover:bg-white/20"
        >
            Import from Drive
        </NorthernButton>
    );
}
