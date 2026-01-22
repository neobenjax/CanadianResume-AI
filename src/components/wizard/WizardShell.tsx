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
            {/* Progress Bar & Steps */}
            <div className="mb-8 md:mb-12">
                {/* Desktop Steps View (Hidden on Mobile) */}
                <div className="hidden md:flex justify-between items-center mb-4 relative z-0">
                    {/* Connecting Line Base */}
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-800 -z-10 rounded-full" />
                    {/* Active Progress Line */}
                    <div
                        className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-primary-600 to-accent-400 -z-10 rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                    />

                    {STEPS.map((step, index) => {
                        const isCompleted = index < currentStepIndex;
                        const isCurrent = index === currentStepIndex;

                        return (
                            <div key={step.id} className="flex flex-col items-center group relative">
                                <div
                                    className={cn(
                                        "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 z-10",
                                        isCompleted ? "bg-primary-600 border-primary-600 text-white" :
                                            isCurrent ? "bg-slate-900 border-primary-500 text-primary-400 shadow-[0_0_15px_rgba(14,165,233,0.3)] scale-110" :
                                                "bg-slate-900 border-slate-700 text-slate-500"
                                    )}
                                >
                                    {isCompleted ? <Check className="w-5 h-5" /> : <span className="text-sm font-semibold">{index + 1}</span>}
                                </div>
                                <span className={cn(
                                    "absolute -bottom-8 text-sm font-medium whitespace-nowrap transition-colors duration-300",
                                    isCurrent ? "text-primary-300" :
                                        isCompleted ? "text-slate-400" : "text-slate-600"
                                )}>
                                    {step.title}
                                </span>
                            </div>
                        );
                    })}
                </div>

                {/* Mobile Compact View (Visible only on Mobile) */}
                <div className="md:hidden">
                    <div className="flex justify-between items-end mb-2">
                        <div>
                            <span className="text-xs font-semibold text-primary-400 uppercase tracking-wider">Step {currentStepIndex + 1} of {STEPS.length}</span>
                            <h2 className="text-xl font-bold text-white leading-tight">{STEPS[currentStepIndex].title}</h2>
                        </div>
                        <span className="text-xs text-slate-500 font-medium">{Math.round(progress)}% Complete</span>
                    </div>
                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-primary-600 to-accent-400 transition-all duration-500"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
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
