import React, { useState } from 'react';
import { Card } from './ui/Card';
import { Check } from 'lucide-react';

interface InitialBalanceModalProps {
    isOpen: boolean;
    onComplete: (balance: number) => void;
}

export const InitialBalanceModal: React.FC<InitialBalanceModalProps> = ({ isOpen, onComplete }) => {
    const [balance, setBalance] = useState('');

    if (!isOpen) return null;

    const handleSubmit = () => {
        const value = parseFloat(balance);
        if (isNaN(value)) return;
        onComplete(value);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
            <Card className="w-full max-w-sm bg-card p-6 rounded-[2rem] space-y-6 shadow-2xl animate-in zoom-in-95 duration-300 border border-primary/20">
                <div className="text-center space-y-2">
                    <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                        💰
                    </div>
                    <h2 className="text-2xl font-bold text-foreground">Comece com o pé direito!</h2>
                    <p className="text-muted text-sm">Qual é o seu saldo atual aproximado em contas e carteira?</p>
                </div>

                <div className="space-y-4">
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted font-bold">R$</span>
                        <input
                            type="number"
                            value={balance}
                            onChange={(e) => setBalance(e.target.value)}
                            placeholder="0,00"
                            autoFocus
                            className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-primary/20 rounded-2xl py-4 pl-12 pr-4 text-3xl font-black text-center text-foreground outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-muted/30"
                        />
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={!balance}
                        className="w-full bg-primary hover:bg-primary/90 text-white font-black py-4 rounded-xl uppercase text-sm tracking-widest shadow-lg shadow-primary/25 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Check size={20} />
                        Confirmar Saldo
                    </button>
                </div>
            </Card>
        </div>
    );
};
