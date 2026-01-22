'use client';

import { useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { NorthernButton } from '@/components/ui/NorthernButton';
import { Modal } from '@/components/ui/Modal';
import { RouteGuard } from '@/components/auth/RouteGuard';
import { ArrowLeft, Trash2, AlertTriangle, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { db } from '@/lib/db';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const handleDeleteData = async () => {
        setIsDeleting(true);
        try {
            await db.delete();
            await db.open(); // Re-open (create fresh DB next time)
            router.replace('/');
        } catch (error) {
            console.error("Failed to delete data:", error);
            alert("Failed to delete data. Please try again or clear browser site data manually.");
            setIsDeleting(false);
            setShowDeleteModal(false);
        }
    };

    return (
        <RouteGuard>
            <div className="space-y-8 animate-in fade-in duration-500">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard">
                        <NorthernButton variant="ghost" className="pl-0 text-slate-300 hover:text-white hover:bg-white/5">
                            <ArrowLeft className="w-5 h-5 mr-1" /> Back
                        </NorthernButton>
                    </Link>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Settings</h1>
                </div>

                <GlassCard className="border-red-500/20 bg-red-950/10">
                    <div className="flex items-start gap-4">
                        <div className="p-3 rounded-full bg-red-500/10 shrink-0">
                            <Trash2 className="w-6 h-6 text-red-400" />
                        </div>
                        <div className="space-y-4 flex-1">
                            <h2 className="text-xl font-semibold text-white">Danger Zone</h2>

                            <div className="p-4 rounded-lg bg-red-500/5 border border-red-500/20 space-y-3">
                                <div className="flex gap-3">
                                    <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                                    <div className="space-y-2">
                                        <p className="text-sm text-red-100/90 font-medium">Delete All Local Data</p>
                                        <p className="text-xs text-red-200/70 leading-relaxed">
                                            This action will permanently erase all your resumes, profiles, and settings stored in this browser.
                                            This process is <strong>irreversible</strong> unless you have previously imported or backed up your data to Google Drive.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-2">
                                <NorthernButton
                                    onClick={() => setShowDeleteModal(true)}
                                    className="bg-red-600 hover:bg-red-700 text-white border-red-500 w-full sm:w-auto"
                                >
                                    Delete All Data & Reset
                                </NorthernButton>
                            </div>
                        </div>
                    </div>
                </GlassCard>

                <GlassCard className="opacity-60 grayscale hover:grayscale-0 transition-all duration-300">
                    <div className="flex items-start gap-4">
                        <div className="p-3 rounded-full bg-emerald-500/10 shrink-0">
                            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-xl font-semibold text-white">About Data Privacy</h2>
                            <p className="text-slate-400 text-sm leading-relaxed max-w-2xl">
                                MapleLeaf Resume is a local-first application. Your data lives entirely in your browser's secure storage (IndexedDB).
                                We do not own servers that store your personal information. You are in complete control of your data privacy.
                            </p>
                        </div>
                    </div>
                </GlassCard>

                {/* Delete Confirmation Modal */}
                <Modal
                    isOpen={showDeleteModal}
                    onClose={() => !isDeleting && setShowDeleteModal(false)}
                    title="Confirm Data Deletion"
                >
                    <div className="space-y-4">
                        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex gap-3 text-red-200">
                            <AlertTriangle className="w-5 h-5 shrink-0" />
                            <p className="text-sm">
                                Are you sure you want to delete everything? This action cannot be undone.
                            </p>
                        </div>

                        <div className="flex justify-end gap-3 mt-6">
                            <NorthernButton
                                variant="outline"
                                onClick={() => setShowDeleteModal(false)}
                                disabled={isDeleting}
                            >
                                Cancel
                            </NorthernButton>
                            <NorthernButton
                                onClick={handleDeleteData}
                                disabled={isDeleting}
                                className="bg-red-600 hover:bg-red-700 text-white border-red-500"
                            >
                                {isDeleting ? 'Erasing...' : 'Yes, Delete Everything'}
                            </NorthernButton>
                        </div>
                    </div>
                </Modal>
            </div>
        </RouteGuard>
    );
}
