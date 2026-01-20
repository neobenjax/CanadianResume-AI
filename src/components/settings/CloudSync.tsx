'use client';

import { useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { DriveService } from '@/lib/google-drive';
import { useProfile } from '@/hooks/use-profile';
import { NorthernButton } from '@/components/ui/NorthernButton';
import { GlassCard } from '@/components/ui/GlassCard';
import { Cloud, Download, Upload, Check, Loader2, AlertCircle } from 'lucide-react';

export function CloudSync() {
    const { profile, updateContact, updateSection } = useProfile();
    const [isSyncing, setIsSyncing] = useState(false);
    const [lastSync, setLastSync] = useState<Date | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);

    const login = useGoogleLogin({
        onSuccess: (tokenResponse) => {
            setAccessToken(tokenResponse.access_token);
            setError(null);
        },
        onError: () => setError('Login Failed'),
        scope: 'https://www.googleapis.com/auth/drive.appdata',
    });

    const handleSync = async (direction: 'upload' | 'download') => {
        if (!accessToken) {
            login();
            return;
        }

        setIsSyncing(true);
        setError(null);

        try {
            const drive = new DriveService(accessToken);

            if (direction === 'upload') {
                if (!profile) return;
                // Upload current profile
                await drive.saveProfile(profile);
            } else {
                // Download and replace
                const data = await drive.loadProfile();
                if (data) {
                    // Ideally validate schema here
                    // Naive update for MVP
                    if (data.contact) await updateContact(data.contact);
                    if (data.experience) await updateSection('experience', data.experience);
                    if (data.education) await updateSection('education', data.education);
                    if (data.skills) await updateSection('skills', data.skills);
                    if (data.volunteering) await updateSection('volunteering', data.volunteering);
                    if (data.certifications) await updateSection('certifications', data.certifications);
                } else {
                    throw new Error("No profile found in Drive.");
                }
            }
            setLastSync(new Date());
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Sync failed');
        } finally {
            setIsSyncing(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
                    <Cloud className="w-6 h-6" />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-slate-900">Google Drive Sync</h3>
                    <p className="text-slate-500 text-sm">Backup your resume data to your personal Google Drive.</p>
                </div>
            </div>

            {!accessToken ? (
                <GlassCard className="text-center py-8">
                    <p className="text-slate-600 mb-4">Connect your Google account to enable sync.</p>
                    <NorthernButton onClick={() => login()} className="bg-white text-slate-700 border border-slate-200 hover:bg-slate-50">
                        <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5 mr-2" alt="Google" />
                        Connect Google Drive
                    </NorthernButton>
                </GlassCard>
            ) : (
                <GlassCard className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4 border-r border-slate-100 pr-6">
                        <h4 className="font-medium text-slate-900 flex items-center">
                            <Upload className="w-4 h-4 mr-2 text-primary-500" /> Backup to Drive
                        </h4>
                        <p className="text-sm text-slate-500">Save your current local profile to the cloud. Overwrites existing cloud backup.</p>
                        <NorthernButton
                            onClick={() => handleSync('upload')}
                            isLoading={isSyncing}
                            className="w-full justify-center"
                        >
                            Upload Profile
                        </NorthernButton>
                    </div>

                    <div className="space-y-4 pl-2">
                        <h4 className="font-medium text-slate-900 flex items-center">
                            <Download className="w-4 h-4 mr-2 text-accent-500" /> Restore from Drive
                        </h4>
                        <p className="text-sm text-slate-500">Replace local data with the version from Google Drive.</p>
                        <NorthernButton
                            variant="secondary"
                            onClick={() => handleSync('download')}
                            isLoading={isSyncing}
                            className="w-full justify-center"
                        >
                            Download & Restore
                        </NorthernButton>
                    </div>
                </GlassCard>
            )}

            {error && (
                <div className="p-4 rounded-xl bg-red-50 text-red-600 text-sm flex items-center">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    {error}
                </div>
            )}

            {lastSync && !error && (
                <div className="p-4 rounded-xl bg-green-50 text-green-700 text-sm flex items-center justify-center">
                    <Check className="w-4 h-4 mr-2" />
                    Sync successful at {lastSync.toLocaleTimeString()}
                </div>
            )}
        </div>
    );
}
