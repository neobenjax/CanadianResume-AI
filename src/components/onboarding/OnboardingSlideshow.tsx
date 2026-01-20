'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, X, Shield, FileText, Wand2, Cloud, User, CheckCircle } from 'lucide-react';
import { NorthernButton } from '@/components/ui/NorthernButton';
import { useGoogleLogin } from '@react-oauth/google';
import { DriveService } from '@/lib/google-drive';
import { db } from '@/lib/db';

const SLIDES = [
    {
        id: 'welcome',
        title: 'Welcome to MapleLeaf Resume',
        description: 'The privacy-focused, AI-powered resume builder tailored for the Canadian job market.',
        icon: FileText,
        color: 'bg-primary-500'
    },
    {
        id: 'profile',
        title: 'Build Your Master Profile',
        description: 'Create your base profile once via our Wizard or import from Google Drive. We structure your data for Canadian employers.',
        icon: User,
        color: 'bg-blue-500'
    },
    {
        id: 'ai',
        title: 'AI-Tailored Resumes',
        description: 'Generate specific resumes for job postings using AI. Optimized for ATS and recruiters while keeping your base data intact.',
        icon: Wand2,
        color: 'bg-violet-500'
    },
    {
        id: 'privacy',
        title: 'Your Data, Your Control',
        description: 'We use Google Drive to sync your data. No hidden servers. Your privacy is paramount.',
        icon: Cloud,
        color: 'bg-green-500'
    }
];

export function OnboardingSlideshow() {
    const [isVisible, setIsVisible] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [dontShowAgain, setDontShowAgain] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const seen = localStorage.getItem('onboarding_seen');
        if (!seen) {
            setIsVisible(true);
        }
    }, []);

    const markSeen = () => {
        // Always mark seen if they complete the flow or click don't show again
        localStorage.setItem('onboarding_seen', 'true');
    };

    const handleClose = () => {
        if (dontShowAgain) {
            markSeen();
        }
        setIsVisible(false);
    };

    const nextSlide = () => {
        if (currentSlide < SLIDES.length - 1) {
            setCurrentSlide(curr => curr + 1);
        } else {
            handleClose();
        }
    };

    const prevSlide = () => {
        if (currentSlide > 0) {
            setCurrentSlide(curr => curr - 1);
        }
    };

    const handleCreateProfile = () => {
        markSeen();
        setIsVisible(false);
        router.push('/wizard');
    };

    const importLogin = useGoogleLogin({
        scope: 'https://www.googleapis.com/auth/drive.appdata',
        onSuccess: async (tokenResponse) => {
            try {
                const driveService = new DriveService(tokenResponse.access_token);
                const profileData = await driveService.loadProfile();

                if (profileData) {
                    await db.user_profile.put({ ...profileData, id: 1 });
                    markSeen();
                    setIsVisible(false);
                    router.push('/dashboard/profile');
                } else {
                    alert('No profile found in your Google Drive Application Data folder.');
                }
            } catch (error) {
                console.error('Failed to import from Drive:', error);
                alert('Failed to import from Drive.');
            }
        },
        onError: () => alert('Google Login Failed')
    });

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative w-full max-w-2xl overflow-hidden bg-white/90 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl dark:bg-slate-950/90 dark:border-slate-800"
            >
                {/* Skip Button */}
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors z-10"
                >
                    <X className="w-6 h-6" />
                </button>

                <div className="flex flex-col h-[550px]">
                    {/* Content Area */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentSlide}
                            initial={{ x: 50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -50, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="flex-1 flex flex-col items-center justify-center p-10 text-center"
                        >
                            <div className={`mb-8 p-6 rounded-3xl ${SLIDES[currentSlide].color} bg-opacity-10 dark:bg-opacity-20`}>
                                {(() => {
                                    const Icon = SLIDES[currentSlide].icon;
                                    return <Icon className={`w-16 h-16 ${SLIDES[currentSlide].color.replace('bg-', 'text-')}`} />;
                                })()}
                            </div>
                            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                                {SLIDES[currentSlide].title}
                            </h2>
                            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-lg leading-relaxed">
                                {SLIDES[currentSlide].description}
                            </p>
                        </motion.div>
                    </AnimatePresence>

                    {/* Footer / Controls */}
                    <div className="p-8 border-t border-slate-200/60 dark:border-slate-800">
                        <div className="flex items-center justify-between mb-6">
                            {/* Pagination Dots */}
                            <div className="flex space-x-2">
                                {SLIDES.map((_, idx) => (
                                    <div
                                        key={idx}
                                        className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === currentSlide
                                            ? 'w-6 bg-primary-600'
                                            : 'bg-slate-300 dark:bg-slate-700'
                                            }`}
                                    />
                                ))}
                            </div>

                            {/* Don't Show Again Checkbox (Only on last slide) */}
                            {currentSlide === SLIDES.length - 1 && (
                                <label className="flex items-center space-x-2 text-sm text-slate-500 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={dontShowAgain}
                                        onChange={(e) => setDontShowAgain(e.target.checked)}
                                        className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                                    />
                                    <span>Don't show this again</span>
                                </label>
                            )}
                        </div>

                        <div className="flex justify-between items-center gap-4">
                            {currentSlide === SLIDES.length - 1 ? (
                                <div className="flex gap-4 w-full justify-end">
                                    <NorthernButton
                                        variant="secondary"
                                        onClick={() => importLogin()}
                                        className="flex-1 md:flex-none"
                                    >
                                        <Cloud className="w-4 h-4 mr-2" /> Import from Drive
                                    </NorthernButton>
                                    <NorthernButton
                                        onClick={handleCreateProfile}
                                        className="flex-1 md:flex-none shadow-glow-primary"
                                    >
                                        Create My Profile <ChevronRight className="w-4 h-4 ml-2" />
                                    </NorthernButton>
                                </div>
                            ) : (
                                <>
                                    <NorthernButton
                                        variant="outline"
                                        onClick={prevSlide}
                                        disabled={currentSlide === 0}
                                        className={`px-6 ${currentSlide === 0 ? 'opacity-0 pointer-events-none' : ''}`}
                                    >
                                        <ChevronLeft className="w-5 h-5 mr-2" /> Back
                                    </NorthernButton>

                                    <NorthernButton
                                        onClick={nextSlide}
                                        className="px-8"
                                    >
                                        Next <ChevronRight className="w-5 h-5 ml-2" />
                                    </NorthernButton>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
