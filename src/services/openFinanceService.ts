import { Transaction } from '../types';

export interface OpenFinanceBank {
    id: string;
    name: string;
    logo: string;
    color: string;
}

export const BANKS: OpenFinanceBank[] = [
    { id: 'nubank', name: 'Nubank', logo: '🟣', color: '#820ad1' },
    { id: 'itau', name: 'Itaú', logo: 'orange', color: '#ec7000' },
    { id: 'bradesco', name: 'Bradesco', logo: 'ad', color: '#cc092f' },
    { id: 'santander', name: 'Santander', logo: 'fire', color: '#ec0000' },
    { id: 'xp', name: 'XP Investimentos', logo: 'black', color: '#000000' },
];

export const openFinanceService = {
    getBanks: () => BANKS,

    fetchTransactions: async (bankId: string): Promise<Partial<Transaction>[]> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const count = Math.floor(Math.random() * 5) + 3; // 3 to 8 transactions
                const bank = BANKS.find(b => b.id === bankId);
                const results: Partial<Transaction>[] = [];

                for (let i = 0; i < count; i++) {
                    const isExpense = Math.random() > 0.3;
                    const amount = Math.floor(Math.random() * 500) + 20;

                    results.push({
                        description: `${isExpense ? 'Compra' : 'Transferência'} ${bank?.name}`,
                        amount: amount,
                        date: new Date().toISOString().split('T')[0],
                        category: isExpense ? 'Estilo de Vida' : 'Renda',
                        establishment: bank?.name || 'Banco',
                        type: isExpense ? 'expense' : 'income',
                        recurrence: 'none'
                    });
                }
                resolve(results);
            }, 1500); // Simulate network delay
        });
    }
};
