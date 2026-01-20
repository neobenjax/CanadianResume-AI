import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface NorthernButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    isLoading?: boolean;
}

export const NorthernButton = forwardRef<HTMLButtonElement, NorthernButtonProps>(
    ({ className, variant = 'primary', isLoading, children, ...props }, ref) => {
        const variants = {
            primary: 'bg-primary-600 hover:bg-primary-500 text-white shadow-lg shadow-primary-500/20 border-transparent',
            secondary: 'bg-slate-800 hover:bg-slate-700 text-slate-100 shadow-lg border-slate-700 shadow-black/20',
            outline: 'bg-transparent border-slate-700 text-slate-300 hover:bg-slate-800 hover:border-slate-600 shadow-sm',
            ghost: 'bg-transparent text-slate-400 hover:bg-slate-800/50 hover:text-primary-400 border-transparent',
        };

        return (
            <button
                ref={ref}
                className={cn(
                    'inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300',
                    'active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none',
                    'border focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500/50',
                    variants[variant],
                    className
                )}
                disabled={isLoading || props.disabled}
                {...props}
            >
                {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
                {children}
            </button>
        );
    }
);

NorthernButton.displayName = 'NorthernButton';
