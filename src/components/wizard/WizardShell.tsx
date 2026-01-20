import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export const STEPS = [
    { id: 'contact', title: 'Contact Info' },
    { id: 'experience', title: 'Experience' },
    { id: 'volunteering', title: 'Volunteering' },
    { id: 'education', title: 'Education' },
    { id: 'certifications', title: 'Certifications' },
    { id: 'skills', title: 'Skills' },
];

interface WizardShellProps {
    currentStepIndex: number;
    children: React.ReactNode;
    stepTitle: string;
    stepDescription: string;
}

export function WizardShell({
    currentStepIndex,
    children,
    stepTitle,
    stepDescription
}: WizardShellProps) {
    const progress = ((currentStepIndex + 1) / STEPS.length) * 100;

    return (
        <div className="w-full max-w-4xl mx-auto p-4 md:p-8">
            {/* Progress Bar & Steps */}
            <div className="bm-12 mb-10">
                <div className="flex justify-between items-center mb-4 relative">
                    {/* Connecting Line */}
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-200 -z-10 rounded-full" />
                    <div
                        className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-primary-600 to-accent-400 -z-10 rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                    />

                    {STEPS.map((step, index) => {
                        const isCompleted = index < currentStepIndex;
                        const isCurrent = index === currentStepIndex;

                        return (
                            <div key={step.id} className="flex flex-col items-center group">
                                <div
                                    className={cn(
                                        "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 bg-white z-0",
                                        isCompleted ? "bg-primary-600 border-primary-600 text-white" :
                                            isCurrent ? "border-primary-600 text-primary-600 shadow-glow-primary scale-110" :
                                                "border-slate-300 text-slate-400"
                                    )}
                                >
                                    {isCompleted ? <Check className="w-6 h-6" /> : <span>{index + 1}</span>}
                                </div>
                                <span className={cn(
                                    "absolute -bottom-8 text-xs font-semibold whitespace-nowrap transition-colors",
                                    isCurrent ? "text-primary-300" : "text-transparent"
                                )}>
                                    {/* Only show label for current/active step on mobile to save space? Or handle responsive logic */}
                                    {/* For now, simplified label: only show current */}
                                    {isCurrent && step.title}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Content Area */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={currentStepIndex}
                transition={{ duration: 0.4 }}
                className="glass-panel rounded-3xl p-8 md:p-12 relative overflow-hidden"
            >
                {/* Decorative Background Blob inside card */}
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary-500/5 rounded-full blur-3xl" />
                <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-accent-400/5 rounded-full blur-3xl" />

                <div className="relative z-10">
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-slate-100 mb-2">{stepTitle}</h2>
                        <p className="text-slate-300">{stepDescription}</p>
                    </div>
                    {children}
                </div>
            </motion.div>
        </div>
    );
}
