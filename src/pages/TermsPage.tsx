
import React, { useState } from 'react';
import { ArrowLeft, FileText, Shield } from 'lucide-react';
import { legalSDK } from '../sdk/legal';
import ReactMarkdown from 'react-markdown'; // Ensure this is installed or handle text display simply

// Simple markdown renderer fallback if react-markdown isn't available
const MarkdownDisplay: React.FC<{ content: string }> = ({ content }) => {
    return (
        <div className="prose dark:prose-invert max-w-none space-y-4 text-slate-600 dark:text-slate-300">
            {content.split('\n').map((line, i) => {
                if (line.startsWith('# ')) return <h1 key={i} className="text-2xl font-bold text-foreground mt-6 mb-4">{line.replace('# ', '')}</h1>;
                if (line.startsWith('## ')) return <h2 key={i} className="text-xl font-bold text-foreground mt-6 mb-3">{line.replace('## ', '')}</h2>;
                if (line.startsWith('**')) return <p key={i} className="font-bold">{line.replace(/\*\*/g, '')}</p>;
                if (line.trim() === '') return <br key={i} />;
                return <p key={i} className="leading-relaxed">{line}</p>;
            })}
        </div>
    );
};

interface TermsPageProps {
    onBack: () => void;
    initialTab?: 'privacy' | 'terms';
}

export const TermsPage: React.FC<TermsPageProps> = ({ onBack, initialTab = 'terms' }) => {
    const [activeTab, setActiveTab] = useState<'privacy' | 'terms'>(initialTab);

    const document = activeTab === 'privacy'
        ? legalSDK.getPrivacyPolicy()
        : legalSDK.getTermsOfUse();

    return (
        <div className="min-h-screen bg-background animate-slide-up flex flex-col">
            {/* Header */}
            <header className="px-6 py-6 flex items-center gap-4 bg-card border-b border-border sticky top-0 z-10">
                <button
                    onClick={onBack}
                    className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-muted hover:text-foreground"
                >
                    <ArrowLeft size={24} />
                </button>
                <h1 className="text-xl font-bold text-foreground">Legal</h1>
            </header>

            {/* Tabs */}
            <div className="p-4 bg-card">
                <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                    <button
                        onClick={() => setActiveTab('terms')}
                        className={`flex-1 py-3 px-4 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${activeTab === 'terms'
                                ? 'bg-background text-primary shadow-sm'
                                : 'text-muted hover:text-foreground'
                            }`}
                    >
                        <FileText size={18} />
                        Termos de Uso
                    </button>
                    <button
                        onClick={() => setActiveTab('privacy')}
                        className={`flex-1 py-3 px-4 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${activeTab === 'privacy'
                                ? 'bg-background text-primary shadow-sm'
                                : 'text-muted hover:text-foreground'
                            }`}
                    >
                        <Shield size={18} />
                        Privacidade
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 p-6 overflow-y-auto">
                <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
                    <div className="mb-6 pb-6 border-b border-border">
                        <h2 className="text-2xl font-bold text-foreground mb-2">{document.title}</h2>
                        <div className="flex items-center gap-4 text-xs font-medium text-muted uppercase tracking-wider">
                            <span>Versão {document.version}</span>
                            <span>•</span>
                            <span>Atualizado em {document.lastUpdated}</span>
                        </div>
                    </div>

                    <MarkdownDisplay content={document.content} />
                </div>
            </div>

            {/* Footer */}
            <div className="p-6 text-center">
                <p className="text-xs text-muted">
                    Ao usar o Finanzo Pro, você concorda com estes termos.
                </p>
            </div>
        </div>
    );
};
