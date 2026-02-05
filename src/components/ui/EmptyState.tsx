import React from 'react';
import { Ghost, LucideIcon } from 'lucide-react';

interface EmptyStateProps {
    title: string;
    message: string;
    icon?: LucideIcon;
    actionLabel?: string;
    onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
    title,
    message,
    icon: Icon = Ghost,
    actionLabel,
    onAction
}) => {
    return (
        <div className="flex flex-col items-center justify-center p-8 text-center space-y-4 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border-2 border-dashed border-border animate-fade-in">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-muted animate-bounce-slow">
                <Icon size={32} strokeWidth={1.5} />
            </div>
            <div className="space-y-1 max-w-xs">
                <h3 className="text-lg font-black text-foreground">{title}</h3>
                <p className="text-sm font-medium text-muted">{message}</p>
            </div>
            {actionLabel && onAction && (
                <button
                    onClick={onAction}
                    className="mt-4 px-6 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-xl text-xs font-black uppercase tracking-widest transition-colors"
                >
                    {actionLabel}
                </button>
            )}
        </div>
    );
};
