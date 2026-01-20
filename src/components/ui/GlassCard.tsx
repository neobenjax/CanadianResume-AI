import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
    hoverEffect?: boolean;
}

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
    ({ className, hoverEffect = false, children, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    'glass-panel rounded-2xl p-6',
                    hoverEffect && 'transition-all duration-300 hover:shadow-glow-primary hover:-translate-y-1 hover:border-primary-200/50',
                    className
                )}
                {...props}
            >
                {children}
            </div>
        );
    }
);

GlassCard.displayName = 'GlassCard';
