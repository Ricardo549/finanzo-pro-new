
import React, { useState } from 'react';
import { ArrowLeft, User, Mail, Lock, Check, X, FileText, Shield, ChevronDown } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { legalSDK } from '../sdk/legal';

interface RegisterPageProps {
    onBack: () => void;
    onComplete: () => void;
    googleUser?: { name: string, email: string } | null;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onBack, onComplete, googleUser }) => {
    const [name, setName] = useState(googleUser?.name || '');
    const [email, setEmail] = useState(googleUser?.email || '');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [acceptedTerms, setAcceptedTerms] = useState(false);

    // Legal Modal State
    const [showLegal, setShowLegal] = useState(false);
    const [legalTab, setLegalTab] = useState<'terms' | 'privacy'>('terms');

    const handleLegalClick = (tab: 'terms' | 'privacy', e: React.MouseEvent) => {
        e.preventDefault();
        setLegalTab(tab);
        setShowLegal(true);
    };

    const activeLegalDoc = legalTab === 'terms' ? legalSDK.getTermsOfUse() : legalSDK.getPrivacyPolicy();

    return (
        <div className="p-6 space-y-6 pb-24 animate-slide-up flex-1 flex flex-col relative">
            <header className="flex items-center gap-4">
                <button onClick={onBack} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-muted hover:text-foreground transition-colors">
                    <ChevronDown className="rotate-90" size={24} />
                </button>
                <div>
                    <h2 className="text-2xl font-black text-foreground">Dê o Play!</h2>
                    <p className="text-muted text-sm font-medium">Crie sua conta e decole.</p>
                </div>
            </header>

            <div className="space-y-4 max-w-sm mx-auto w-full">
                <div className="bg-slate-50 dark:bg-slate-900 border border-border p-6 rounded-3xl text-center space-y-2 mb-4">
                    <h3 className="text-xl font-black text-foreground">Plano Grátis</h3>
                    <p className="text-sm text-muted">Acesso básico à firma.</p>
                </div>

                <div className="space-y-3">
                    <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
                        <input className="w-full bg-card py-4 pl-12 pr-4 rounded-xl border border-border outline-none focus:border-primary transition-colors text-foreground" placeholder="Nome Completo" value={name} onChange={e => setName(e.target.value)} readOnly={!!googleUser} />
                    </div>
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
                        <input className="w-full bg-card py-4 pl-12 pr-4 rounded-xl border border-border outline-none focus:border-primary transition-colors text-foreground" placeholder="E-mail" type="email" value={email} onChange={e => setEmail(e.target.value)} readOnly={!!googleUser} />
                    </div>
                    {!googleUser && (
                        <>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
                                <input className="w-full bg-card py-4 pl-12 pr-4 rounded-xl border border-border outline-none focus:border-primary transition-colors text-foreground" placeholder="Senha" type="password" value={password} onChange={e => setPassword(e.target.value)} />
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
                                <input className="w-full bg-card py-4 pl-12 pr-4 rounded-xl border border-border outline-none focus:border-primary transition-colors text-foreground" placeholder="Confirmar Senha" type="password" value={confirm} onChange={e => setConfirm(e.target.value)} />
                            </div>
                        </>
                    )}
                </div>

                <label className="flex items-start gap-3 p-2 cursor-pointer select-none">
                    <input type="checkbox" checked={acceptedTerms} onChange={e => setAcceptedTerms(e.target.checked)} className="mt-1 w-4 h-4 accent-primary" />
                    <span className="text-xs text-muted leading-relaxed">
                        Concordo com os <button onClick={(e) => handleLegalClick('terms', e)} className="underline text-primary font-bold hover:text-primary/80">Termos de Uso</button> e <button onClick={(e) => handleLegalClick('privacy', e)} className="underline text-primary font-bold hover:text-primary/80">Política de Privacidade</button> do Finanzo Pro.
                    </span>
                </label>

                <button disabled={!acceptedTerms} onClick={onComplete} className={`w-full text-white p-4 rounded-xl font-black uppercase text-xs tracking-widest shadow-lg mt-4 flex items-center justify-center gap-2 transition-all ${acceptedTerms ? 'bg-primary hover:opacity-90 active:scale-95' : 'bg-slate-300 dark:bg-slate-800 cursor-not-allowed opacity-50'}`}>
                    Criar Conta Grátis <Check size={16} />
                </button>
            </div>

            {/* Legal Banner/Modal Overlay */}
            {showLegal && (
                <div className="absolute inset-0 z-50 bg-background/95 backdrop-blur-md flex flex-col animate-in slide-in-from-bottom duration-300 rounded-3xl overflow-hidden border border-border shadow-2xl m-2">
                    {/* Modal Header */}
                    <div className="p-4 border-b border-border flex items-center justify-between bg-card text-foreground">
                        <h3 className="text-sm font-bold flex items-center gap-2 uppercase tracking-wide">
                            {activeLegalDoc.id === 'terms-of-use' ? <FileText size={16} className="text-primary" /> : <Shield size={16} className="text-primary" />}
                            {activeLegalDoc.title}
                        </h3>
                        <button onClick={() => setShowLegal(false)} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-muted hover:text-foreground">
                            <X size={18} />
                        </button>
                    </div>

                    {/* Modal Content */}
                    <div className="flex-1 overflow-y-auto p-6 text-sm text-foreground/80 leading-relaxed dark:text-slate-300">
                        <p className="text-xs font-bold text-muted mb-4 uppercase tracking-widest">
                            Versão {activeLegalDoc.version} • {activeLegalDoc.lastUpdated}
                        </p>
                        <div className="whitespace-pre-wrap font-medium space-y-2">
                            {activeLegalDoc.content}
                        </div>
                    </div>

                    {/* Modal Toggle Footer */}
                    <div className="p-3 border-t border-border bg-card flex gap-2">
                        <button
                            onClick={() => setLegalTab('terms')}
                            className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${legalTab === 'terms' ? 'bg-primary text-white shadow-md' : 'bg-slate-100 dark:bg-slate-800 text-muted hover:bg-slate-200'}`}
                        >
                            Termos
                        </button>
                        <button
                            onClick={() => setLegalTab('privacy')}
                            className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${legalTab === 'privacy' ? 'bg-primary text-white shadow-md' : 'bg-slate-100 dark:bg-slate-800 text-muted hover:bg-slate-200'}`}
                        >
                            Privacidade
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
