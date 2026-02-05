
import React, { useState, useRef } from 'react';
import { Calendar, X, Check, Camera, Upload, MessageSquare, Repeat } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Transaction } from '../../types';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES, TRANSFER_CATEGORIES, CategoryItem, TransactionType } from '../constants/categories';

interface EntriesPageProps {
    t: any;
    isPro: boolean;
    onAddInvestment: (amount: number) => void;
    // Legacy props kept for compatibility but might be unused in new design
    categories?: string[];
    onAddCategory?: (cat: string) => void;
    language: string;
    transactions: Transaction[];
    onAddTransaction: (transaction: Omit<Transaction, 'id'>) => Promise<void>;
}

export const EntriesPage: React.FC<EntriesPageProps> = ({ t, onAddInvestment, language, transactions, onAddTransaction }) => {
    // UI State
    const [transactionType, setTransactionType] = useState<TransactionType>('expense');
    const [overlayOpen, setOverlayOpen] = useState(false);

    // Form State
    const [selectedCategory, setSelectedCategory] = useState<CategoryItem | null>(null);
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    // Recurrence State
    const [isRecurring, setIsRecurring] = useState(false);
    const [recurrenceCount, setRecurrenceCount] = useState('12');

    // Scanner Refs
    const fileInputRef = useRef<HTMLInputElement>(null);

    const activeCategories =
        transactionType === 'expense' ? EXPENSE_CATEGORIES :
            transactionType === 'income' ? INCOME_CATEGORIES :
                TRANSFER_CATEGORIES;

    const handleCategoryClick = (category: CategoryItem) => {
        setSelectedCategory(category);
        setOverlayOpen(true);
        // Reset form for new entry
        setAmount('');
        setDescription('');
        setDate(new Date().toISOString().split('T')[0]);
        setIsRecurring(false);
        setRecurrenceCount('12');
    };

    const handleSubmit = () => {
        if (!amount || !selectedCategory) return;

        const numAmount = parseFloat(amount);
        if (isNaN(numAmount) || numAmount <= 0) {
            alert("Por favor, insira um valor válido.");
            return;
        }

        const count = isRecurring ? parseInt(recurrenceCount) : 1;
        const startDate = new Date(date);

        const promises = [];

        for (let i = 0; i < count; i++) {
            const currentDate = new Date(startDate);
            currentDate.setMonth(startDate.getMonth() + i);

            const newTx = {
                description: isRecurring ? `${description.trim() || selectedCategory.label} (${i + 1}/${count})` : (description.trim() || selectedCategory.label),
                amount: numAmount,
                date: currentDate.toISOString().split('T')[0],
                category: selectedCategory.label,
                establishment: '',
                type: (transactionType === 'expense' || transactionType === 'income') ? transactionType : 'expense' as any,
                // Recurrence fields if needed by backend, but we are expanding them here manually
            };

            promises.push(onAddTransaction(newTx));
        }

        Promise.all(promises).then(() => {
            if (selectedCategory.label === 'Investimentos') {
                onAddInvestment(numAmount * count);
            }
        });

        setOverlayOpen(false);
    };

    return (
        <div className="p-4 space-y-4 pb-24 h-full flex flex-col animate-slide-up bg-background min-h-screen transition-colors duration-300">
            {/* Header / Tabs */}
            <div className="flex items-center justify-between pt-2 pb-4">
                <button className="font-medium text-muted hover:text-foreground transition-colors" onClick={() => { }}>Cancelar</button>
                <h2 className="text-xl font-bold text-foreground">Adicionar</h2>
                <div className="w-16"></div> {/* Spacer for center alignment */}
            </div>

            {/* Tabs */}
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl mb-4">
                {(['expense', 'income', 'transfer'] as const).map((type) => (
                    <button
                        key={type}
                        onClick={() => setTransactionType(type)}
                        className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all capitalize ${transactionType === type
                            ? 'bg-card text-primary shadow-md'
                            : 'text-muted hover:text-foreground'
                            }`}
                    >
                        {type === 'expense' ? 'Despesa' : type === 'income' ? 'Receita' : 'Transferência'}
                    </button>
                ))}
            </div>

            {/* Grid */}
            <div className="bg-card rounded-t-[2.5rem] flex-1 -mx-4 px-6 pt-8 pb-32 border-t border-border space-y-12">
                <div className="grid grid-cols-4 gap-y-8 gap-x-4">
                    {activeCategories.map((cat) => (
                        <div
                            key={cat.id}
                            className="flex flex-col items-center gap-2 cursor-pointer group"
                            onClick={() => handleCategoryClick(cat)}
                        >
                            <div className="w-14 h-14 rounded-full bg-slate-50 dark:bg-slate-800 group-hover:bg-primary/10 transition-colors flex items-center justify-center text-muted group-hover:text-primary">
                                <cat.icon size={24} strokeWidth={1.5} />
                            </div>
                            <span className="text-xs font-medium text-muted text-center leading-tight group-hover:text-foreground transition-colors">
                                {cat.label}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Scanner Section (Restored) */}
                <div className="pt-8 border-t border-border">
                    <Card className="py-8 text-center space-y-4 flex flex-col items-center bg-slate-50 dark:bg-slate-900 border-dashed border-2">
                        <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                            <div className="absolute -inset-1 bg-primary rounded-[2rem] blur opacity-10 group-hover:opacity-30 transition duration-1000 group-hover:duration-200"></div>
                            <div className="relative w-16 h-16 bg-card border-2 border-primary border-dashed rounded-[1.5rem] flex items-center justify-center text-primary group-active:scale-90 transition-all">
                                <Camera size={28} />
                            </div>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-muted uppercase tracking-widest">{t.scanner || "IA Scanner"}</p>
                            <p className="text-[10px] text-muted mt-1 px-8">Analise extratos ou cupons via IA</p>
                        </div>
                        <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
                            <label className="flex items-center justify-center gap-2 p-3 bg-white dark:bg-black rounded-2xl border border-border text-muted active:scale-95 transition-all cursor-pointer shadow-sm">
                                <Upload size={14} /> <span className="text-[9px] font-black uppercase">Arquivo</span>
                                <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={() => { alert('IA Finanzo: Comprovante analisado com sucesso! (Simulação)'); }} />
                            </label>
                            <button onClick={() => { const text = prompt('Cole o texto do comprovante:'); if (text) { alert('IA processou: ' + text.substring(0, 20) + '...'); } }} className="flex items-center justify-center gap-2 p-3 bg-white dark:bg-black rounded-2xl border border-border text-muted active:scale-95 transition-all shadow-sm"><MessageSquare size={14} /> <span className="text-[9px] font-black uppercase">Texto</span></button>
                        </div>
                    </Card>
                </div>
            </div>

            {/* Overlay Input Form */}
            {overlayOpen && selectedCategory && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center animate-in fade-in duration-200">
                    <div className="bg-card w-full max-w-md p-6 rounded-t-[2rem] sm:rounded-[2rem] shadow-2xl space-y-6 animate-in slide-in-from-bottom duration-300 border-t sm:border border-border">

                        {/* Overlay Header */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                    <selectedCategory.icon size={24} />
                                </div>
                                <h3 className="text-xl font-bold text-foreground">{selectedCategory.label}</h3>
                            </div>
                            <button
                                onClick={() => setOverlayOpen(false)}
                                className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-muted hover:text-foreground transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Amount Input */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-muted uppercase tracking-widest">Valor</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted font-medium">R$</span>
                                <input
                                    type="number"
                                    autoFocus
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="0,00"
                                    className="w-full bg-slate-50 dark:bg-slate-900 border border-border rounded-2xl py-4 pl-12 pr-4 text-3xl font-black text-foreground outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                                />
                            </div>
                        </div>

                        {/* Description (Optional) */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-muted uppercase tracking-widest">Descrição (Opcional)</label>
                            <input
                                type="text"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder={selectedCategory.label}
                                className="w-full bg-slate-50 dark:bg-slate-900 border border-border rounded-xl p-4 font-medium text-foreground outline-none focus:border-primary transition-all"
                            />
                        </div>

                        {/* Recurrence Toggle */}
                        <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-border">
                            <div className="flex-1 flex items-center gap-2 cursor-pointer select-none" onClick={() => setIsRecurring(!isRecurring)}>
                                <div className={`w-10 h-6 rounded-full transition-colors relative ${isRecurring ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-700'}`}>
                                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isRecurring ? 'right-1' : 'left-1'}`}></div>
                                </div>
                                <span className="text-xs font-bold text-muted uppercase tracking-wider flex items-center gap-1"><Repeat size={14} /> Repetir</span>
                            </div>
                            {isRecurring && (
                                <div className="flex items-center gap-2 animate-slide-up">
                                    <span className="text-[10px] font-black uppercase text-muted">Vezes:</span>
                                    <input type="number" value={recurrenceCount} onChange={e => setRecurrenceCount(e.target.value)} className="w-16 bg-white dark:bg-black p-2 rounded-lg text-center font-bold outline-none border border-border text-sm" />
                                </div>
                            )}
                        </div>

                        {/* Date */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-muted uppercase tracking-widest">Data</label>
                            <div className="relative">
                                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
                                <input
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="w-full bg-slate-50 dark:bg-slate-900 border border-border rounded-xl py-4 pl-12 pr-4 font-bold text-foreground outline-none focus:border-primary transition-all"
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            onClick={handleSubmit}
                            className="w-full bg-primary hover:bg-primary/90 text-white font-black py-4 rounded-xl uppercase text-sm tracking-widest shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
                        >
                            <Check size={20} />
                            Confirmar Lançamento
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
