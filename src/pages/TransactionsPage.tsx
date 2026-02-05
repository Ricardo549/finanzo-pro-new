import React, { useMemo, useState } from 'react';
import { ArrowUpRight, ArrowDownLeft, Search, Filter } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Transaction } from '../../types';
import { EmptyState } from '../components/ui/EmptyState';
import { OpenFinanceModal } from '../components/OpenFinanceModal';

interface TransactionsPageProps {
    transactions: Transaction[];
    onBack?: () => void;
    onAddClick?: () => void;
    onTransactionsUpdate?: () => void; // Callback to refresh parent list if needed, or we rely on parent's state
    // Given App.tsx structure, we might need a way to propagate new transactions up.
    // For now, let's assume we can call a prop like onImportTransactions
    onImportTransactions?: (txs: Partial<Transaction>[]) => void;
}

export const TransactionsPage: React.FC<TransactionsPageProps> = ({ transactions, onAddClick, onImportTransactions }) => {
    const [showOpenFinance, setShowOpenFinance] = useState(false);

    // Group transactions by date
    const groupedTransactions = useMemo(() => {
        const groups: Record<string, Transaction[]> = {};
        transactions.forEach(tx => {
            if (!groups[tx.date]) {
                groups[tx.date] = [];
            }
            groups[tx.date].push(tx);
        });

        // Sort dates descending
        return Object.keys(groups).sort((a, b) => new Date(b).getTime() - new Date(a).getTime()).map(date => ({
            date,
            items: groups[date]
        }));
    }, [transactions]);

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        if (dateStr === today.toISOString().split('T')[0]) return 'Hoje';
        if (dateStr === yesterday.toISOString().split('T')[0]) return 'Ontem';

        return date.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' });
    };

    return (
        <div className="p-4 space-y-4 pb-24 min-h-screen bg-background animate-slide-up">
            <header className="flex items-center justify-between pt-2 pb-2">
                <h2 className="text-xl font-bold text-foreground">Extrato</h2>
                <div className="flex gap-2">
                    <button
                        onClick={() => setShowOpenFinance(true)}
                        className="p-1 rounded-full bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 hover:scale-105 transition-all w-10 h-10 flex items-center justify-center overflow-hidden"
                        title="Conectar Open Finance"
                    >
                        <img
                            src="https://raw.githubusercontent.com/openfinancebrasil/marca/main/open-finance-logo.png"
                            alt="Open Finance"
                            className="w-full h-full object-contain p-1"
                            onError={(e) => {
                                // Fallback if image fails
                                (e.target as HTMLImageElement).style.display = 'none';
                                (e.target as HTMLImageElement).parentElement!.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-link"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>';
                            }}
                        />
                    </button>
                    <button className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-muted hover:text-foreground transition-colors">
                        <Search size={20} />
                    </button>
                    <button className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-muted hover:text-foreground transition-colors">
                        <Filter size={20} />
                    </button>
                </div>
            </header>

            {transactions.length === 0 ? (
                <div className="mt-12">
                    <EmptyState
                        title="Sem lançamentos"
                        message="Você ainda não registrou nenhuma movimentação."
                        actionLabel="Adicionar Agora"
                        onAction={onAddClick || (() => { })}
                    />
                </div>
            ) : (
                <div className="space-y-6">
                    {groupedTransactions.map(group => (
                        <div key={group.date} className="space-y-3">
                            <h3 className="text-xs font-bold text-muted uppercase tracking-widest pl-2 sticky top-0 bg-background/80 backdrop-blur-md py-2 z-10">
                                {formatDate(group.date)}
                            </h3>
                            {group.items.map((tx, index) => (
                                <Card key={tx.id || index} className="flex items-center justify-between p-4 active:scale-[0.99] transition-transform">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.type === 'income'
                                            ? 'bg-emerald-500/10 text-emerald-500'
                                            : 'bg-rose-500/10 text-rose-500'
                                            }`}>
                                            {tx.type === 'income' ? <ArrowUpRight size={20} /> : <ArrowDownLeft size={20} />}
                                        </div>
                                        <div>
                                            <p className="font-bold text-foreground text-sm">{tx.description}</p>
                                            <p className="text-[10px] text-muted font-medium uppercase">{tx.category}</p>
                                        </div>
                                    </div>
                                    <span className={`font-bold text-sm ${tx.type === 'income' ? 'text-emerald-500' : 'text-rose-500'
                                        }`}>
                                        {tx.type === 'expense' ? '- ' : '+ '}
                                        R$ {Number(tx.amount).toFixed(2).replace('.', ',')}
                                    </span>
                                </Card>
                            ))}
                        </div>
                    ))}
                </div>
            )}

            <OpenFinanceModal
                isOpen={showOpenFinance}
                onClose={() => setShowOpenFinance(false)}
                onImport={(importedTxs) => {
                    if (onImportTransactions) {
                        onImportTransactions(importedTxs);
                    }
                }}
            />
        </div>
    );
};
