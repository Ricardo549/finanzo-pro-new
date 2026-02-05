import React, { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { Card } from './ui/Card';

interface DeleteAccountModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (reason: string) => void;
}

export const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({ isOpen, onClose, onConfirm }) => {
    const [reason, setReason] = useState('');
    const [customReason, setCustomReason] = useState('');

    if (!isOpen) return null;

    const reasons = [
        "Não achei útil",
        "Achei muito caro",
        "Encontrei outro app melhor",
        "Outro motivo"
    ];

    const handleConfirm = () => {
        const finalReason = reason === 'Outro motivo' ? customReason : reason;
        if (finalReason.trim().length > 0) {
            onConfirm(finalReason);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
            <Card className="w-full max-w-sm space-y-6 relative animate-slide-up bg-white dark:bg-slate-900 shadow-2xl">
                <button onClick={onClose} className="absolute top-4 right-4 text-muted hover:text-foreground transition-colors">
                    <X size={20} />
                </button>

                <div className="text-center space-y-2">
                    <div className="w-12 h-12 bg-rose-100 dark:bg-rose-900/30 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertTriangle size={24} />
                    </div>
                    <h3 className="text-xl font-black text-foreground">Tem certeza que deseja partir?</h3>
                    <p className="text-sm text-muted">Essa ação é irreversível e todos os seus dados serão apagados.</p>
                </div>

                <div className="space-y-3">
                    <label className="text-xs font-bold text-foreground uppercase">Por que você está saindo?</label>
                    <div className="space-y-2">
                        {reasons.map(r => (
                            <label key={r} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${reason === r ? 'border-primary bg-primary/5' : 'border-border hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                                <input
                                    type="radio"
                                    name="deleteReason"
                                    value={r}
                                    checked={reason === r}
                                    onChange={(e) => setReason(e.target.value)}
                                    className="accent-primary"
                                />
                                <span className="text-sm font-medium">{r}</span>
                            </label>
                        ))}
                    </div>

                    {reason === 'Outro motivo' && (
                        <textarea
                            className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-border rounded-xl text-sm outline-none focus:border-primary transition-colors min-h-[80px]"
                            placeholder="Conte-nos mais..."
                            value={customReason}
                            onChange={(e) => setCustomReason(e.target.value)}
                        />
                    )}
                </div>

                <div className="flex gap-3 pt-2">
                    <button
                        onClick={onClose}
                        className="flex-1 p-3 rounded-xl font-bold text-sm bg-slate-100 dark:bg-slate-800 text-foreground hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={!reason || (reason === 'Outro motivo' && !customReason)}
                        className="flex-1 p-3 rounded-xl font-bold text-sm bg-rose-500 text-white hover:bg-rose-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Excluir Conta
                    </button>
                </div>
            </Card>
        </div>
    );
};
