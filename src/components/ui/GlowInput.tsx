import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface GlowInputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    textClassName?: string;
}

export const GlowInput = forwardRef<HTMLInputElement, GlowInputProps>(
    ({ className, label, error, id, textClassName, ...props }, ref) => {
        return (
            <div className="space-y-2 w-full">
                {label && (
                    <label htmlFor={id} className="block text-sm font-medium text-slate-200 ml-1">
                        {label}
                    </label>
                )}
                <div className="relative group">
                    <input
                        ref={ref}
                        id={id}
                        className={cn(
                            'w-full px-4 py-3 bg-slate-800/50 backdrop-blur-sm rounded-xl',
                            'border border-slate-700 transition-all duration-300',
                            'focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500',
                            'placeholder:text-slate-500',
                            textClassName || 'text-slate-100', // Default to slate-100 if not provided, or let caller override
                            'group-hover:border-primary-500/50',
                            error && 'border-red-500 focus:ring-red-500/50 focus:border-red-500',
                            className
                        )}
                        {...props}
                    />
                    {/* Outer Glow Effect on Focus (via Shadow in Tailwind config, but we can enhance it here) */}
                </div>
                {error && (
                    <p className="text-sm text-red-500 ml-1 animate-in fade-in slide-in-from-top-1">
                        {error}
                    </p>
                )}
            </div>
        );
    }
);

GlowInput.displayName = 'GlowInput';
