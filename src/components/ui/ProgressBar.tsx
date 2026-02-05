import React from 'react';

export const ProgressBar: React.FC<{ progress: number, color?: string }> = ({ progress, color = "bg-primary" }) => (
    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
        <div className="h-full bg-primary transition-all duration-700" style={{ width: `${Math.min(100, progress)}%` }} />
    </div>
);
