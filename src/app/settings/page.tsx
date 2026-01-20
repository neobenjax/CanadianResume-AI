'use client';

import { GoogleOAuthProvider } from '@react-oauth/google';
import { CloudSync } from '@/components/settings/CloudSync';
import { GlassCard } from '@/components/ui/GlassCard';
import { NorthernButton } from '@/components/ui/NorthernButton';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

// NOTE: In production, this comes from process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
// For this scaffolding, we use a placeholder that the user must replace.
const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';

export default function SettingsPage() {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center gap-4">
                <Link href="/dashboard">
                    <NorthernButton variant="ghost" className="pl-0">
                        <ArrowLeft className="w-5 h-5 mr-1" /> Back
                    </NorthernButton>
                </Link>
                <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
            </div>

            <GlassCard>
                <h2 className="text-xl font-semibold mb-6 flex items-center text-slate-900">
                    Data Synchronization
                </h2>

                {!GOOGLE_CLIENT_ID ? (
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800">
                        <h3 className="font-bold mb-2">Google Client ID Missing</h3>
                        <p className="text-sm mb-4">
                            To enable Google Drive Sync, you need to create a Project in Google Cloud Console, enable Drive API, and obtain an OAuth 2.0 Client ID.
                        </p>
                        <div className="bg-white p-3 rounded-lg overflow-x-auto border border-amber-200 mb-4">
                            <code className="text-xs">NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com</code>
                        </div>
                        <p className="text-sm">
                            Add this to your <code>.env.local</code> file in the project root.
                        </p>
                    </div>
                ) : (
                    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
                        <CloudSync />
                    </GoogleOAuthProvider>
                )}
            </GlassCard>

            <GlassCard>
                <h2 className="text-xl font-semibold mb-4 text-slate-900">Application Data</h2>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 mb-4">
                    <p className="text-sm text-slate-600">
                        All your data is stored locally in your browser (IndexedDB).
                        Cleaning your browser cache will remove this data unless you sync to Drive.
                    </p>
                </div>
                <NorthernButton variant="outline" className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300">
                    Delete All Local Data
                </NorthernButton>
            </GlassCard>
        </div>
    );
}
