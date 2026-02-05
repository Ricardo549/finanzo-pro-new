import React, { useState } from 'react';
import { ChevronDown, CreditCard, ArrowRight, Check } from 'lucide-react';

interface CheckoutPageProps {
    onBack: () => void;
    onSubscribe: () => void;
    googleUser: { name: string, email: string } | null;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ onBack, onSubscribe, googleUser }) => {
    const [step, setStep] = useState(1);
    const [acceptedTerms, setAcceptedTerms] = useState(false);

    return (
        <div className="p-6 space-y-6 pb-24 animate-slide-up">
            <header className="flex items-center gap-4">
                <button onClick={onBack} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-muted hover:text-foreground transition-colors"><ChevronDown className="rotate-90" size={24} /></button>
                <h2 className="text-2xl font-black text-foreground">Checkout</h2>
            </header>

            <div className="bg-primary/5 border border-primary/20 p-6 rounded-3xl text-center space-y-2">
                <p className="text-xs font-black uppercase tracking-widest text-primary">Plano Selecionado</p>
                <h3 className="text-3xl font-black text-foreground">Pro (Brother)</h3>
                <p className="text-lg font-bold text-muted">R$ 29,90 <span className="text-xs font-normal">/mês</span></p>
            </div>

            <div className="space-y-4">
                <h4 className="font-black text-sm uppercase tracking-widest text-muted pl-1">{step === 1 ? '1. Criar Conta' : '2. Pagamento Seguro'}</h4>

                {step === 1 ? (
                    <div className="space-y-3 animate-slide-right">
                        <input className="w-full bg-card p-4 rounded-xl border border-border outline-none focus:border-primary transition-colors text-foreground" placeholder="Nome Completo" />
                        <input className="w-full bg-card p-4 rounded-xl border border-border outline-none focus:border-primary transition-colors text-foreground" placeholder="CPF" />
                        <input className="w-full bg-card p-4 rounded-xl border border-border outline-none focus:border-primary transition-colors text-foreground" placeholder="E-mail" type="email" />
                        <input className="w-full bg-card p-4 rounded-xl border border-border outline-none focus:border-primary transition-colors text-foreground" placeholder="Senha" type="password" />

                        <label className="flex items-start gap-3 p-2 cursor-pointer mt-2">
                            <input type="checkbox" checked={acceptedTerms} onChange={e => setAcceptedTerms(e.target.checked)} className="mt-1 w-4 h-4 accent-primary" />
                            <span className="text-xs text-muted leading-relaxed">Concordo com os <a href="#" className="underline text-primary">Termos de Uso</a> e <a href="#" className="underline text-primary">Política de Privacidade</a> do Finanzo Pro.</span>
                        </label>

                        <button disabled={!acceptedTerms} onClick={() => setStep(2)} className={`w-full text-white p-4 rounded-xl font-black uppercase text-xs tracking-widest shadow-lg mt-4 flex items-center justify-center gap-2 transition-all ${acceptedTerms ? 'bg-primary hover:opacity-90 active:scale-95' : 'bg-slate-300 dark:bg-slate-800 cursor-not-allowed opacity-50'}`}>Próximo <ArrowRight size={16} /></button>
                    </div>
                ) : (
                    <div className="space-y-4 animate-slide-right">
                        <div className="p-4 bg-slate-800 rounded-xl text-white mb-6 flex flex-col justify-between h-40 shadow-xl relative overflow-hidden ring-4 ring-slate-100 dark:ring-slate-800">
                            <div className="absolute top-0 right-0 p-4 opacity-50"><CreditCard size={48} /></div>
                            <p className="font-mono text-xl tracking-widest mt-8">{'**** **** **** ****'}</p>
                            <div className="flex justify-between text-xs opacity-80 uppercase">
                                <span>Nome do Titular</span>
                                <span>MM/AA</span>
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-bold text-muted uppercase ml-1 mb-1 block">Número do Cartão</label>
                            <input className="w-full bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-border outline-none focus:border-primary transition-colors text-foreground" placeholder="0000 0000 0000 0000" />
                        </div>

                        <div className="flex gap-3">
                            <div className="flex-1">
                                <label className="text-xs font-bold text-muted uppercase ml-1 mb-1 block">Validade</label>
                                <input className="w-full bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-border outline-none focus:border-primary transition-colors text-foreground" placeholder="MM/AA" />
                            </div>
                            <div className="w-28">
                                <label className="text-xs font-bold text-muted uppercase ml-1 mb-1 block">CVV</label>
                                <input className="w-full bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-border outline-none focus:border-primary transition-colors text-foreground" placeholder="123" />
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-bold text-muted uppercase ml-1 mb-1 block">Nome no Cartão</label>
                            <input className="w-full bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-border outline-none focus:border-primary transition-colors text-foreground" placeholder="Nome como impresso" />
                        </div>

                        <button onClick={onSubscribe} className="w-full bg-emerald-500 text-white p-4 rounded-xl font-black uppercase text-xs tracking-widest shadow-lg mt-6 flex items-center justify-center gap-2 hover:bg-emerald-400 transition-colors">Confirmar Assinatura <Check size={16} /></button>
                    </div>
                )}
            </div>
        </div>
    );
};
