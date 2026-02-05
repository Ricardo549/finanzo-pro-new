import React from 'react';

export const Card: React.FC<React.HTMLAttributes<HTMLDivElement> & { children: React.ReactNode; className?: string }> = ({ children, className = "", ...props }) => (
    <div className={`bg-card rounded-3xl p-5 shadow-sm border border-border transition-colors ${className}`} {...props}>
        {children}
    </div>
);
