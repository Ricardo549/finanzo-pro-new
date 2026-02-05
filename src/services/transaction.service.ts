import { Transaction } from '../types';
import { supabase } from './supabase';

const MOCK_DELAY = 600;
const ENABLE_MOCKS = import.meta.env.VITE_ENABLE_MOCKS === 'true';

export const transactionService = {
    getAll: async (): Promise<Transaction[]> => {
        if (!ENABLE_MOCKS && supabase) {
            const { data, error } = await supabase
                .from('transactions')
                .select('*')
                .order('date', { ascending: false });

            if (error) throw new Error(error.message);

            return data.map((t: any) => ({
                id: t.id,
                description: t.description,
                amount: Number(t.amount),
                date: t.date,
                category: t.category,
                establishment: t.establishment,
                type: t.type,
                recurrence: t.recurrence,
                adjustmentRate: t.adjustment_rate
            })) as Transaction[];
        }

        // --- MOCK IMPLEMENTATION ---
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([
                    {
                        id: '1',
                        description: 'Salário',
                        amount: 5000,
                        date: new Date().toISOString().split('T')[0],
                        category: 'Renda',
                        establishment: 'Empresa X',
                        type: 'income'
                    },
                    {
                        id: '2',
                        description: 'Aluguel',
                        amount: 1500,
                        date: new Date().toISOString().split('T')[0],
                        category: 'Moradia',
                        establishment: 'Imobiliária Y',
                        type: 'expense'
                    }
                ]);
            }, MOCK_DELAY);
        });
    },

    create: async (transaction: Omit<Transaction, 'id'>): Promise<Transaction> => {
        if (!ENABLE_MOCKS && supabase) {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Usuário não autenticado');

            const dbPayload = {
                user_id: user.id,
                description: transaction.description,
                amount: transaction.amount,
                date: transaction.date,
                category: transaction.category,
                establishment: transaction.establishment,
                type: transaction.type,
                recurrence: transaction.recurrence,
                adjustment_rate: transaction.adjustmentRate
            };

            const { data, error } = await supabase
                .from('transactions')
                .insert([dbPayload])
                .select()
                .single();

            if (error) throw new Error(error.message);

            return {
                id: data.id,
                description: data.description,
                amount: Number(data.amount),
                date: data.date,
                category: data.category,
                establishment: data.establishment,
                type: data.type,
                recurrence: data.recurrence,
                adjustmentRate: data.adjustment_rate
            } as Transaction;
        }

        // --- MOCK IMPLEMENTATION ---
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    id: Math.random().toString(36).substr(2, 9),
                    ...transaction
                });
            }, MOCK_DELAY);
        });
    },

    delete: async (id: string): Promise<void> => {
        if (!ENABLE_MOCKS && supabase) {
            const { error } = await supabase
                .from('transactions')
                .delete()
                .eq('id', id);

            if (error) throw new Error(error.message);
            return;
        }

        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, MOCK_DELAY);
        });
    }
};
