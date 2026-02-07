import { Transaction } from '@/types';
import { supabase } from './supabase';

export const pluggyService = {
    /**
     * Authenticates with Pluggy to get an access token via Edge Function.
     */
    getAccessToken: async (): Promise<string> => {
        if (!supabase) throw new Error('Supabase client not initialized');

        const { data, error } = await supabase.functions.invoke('connect-pluggy', {
            body: { action: 'getAccessToken' }
        });

        if (error) {
            console.error('Pluggy Auth Error:', error);
            throw new Error('Failed to auth with Pluggy');
        }

        return data.apiKey;
    },

    /**
     * Creates a Connect Token to initialize the Pluggy Widget via Edge Function.
     */
    createConnectToken: async (): Promise<string> => {
        if (!supabase) throw new Error('Supabase client not initialized');

        // We can pass options if needed, but for now we generate user ID in the backend or here?
        // Let's generate it here for now as part of options to match previous logic, 
        // or let backend handle it. The backend implementation I wrote used `body || {}`.
        // Let's pass the clientUserId in body options.
        const clientUserId = 'user_' + Math.random().toString(36).substr(2, 9);

        const { data, error } = await supabase.functions.invoke('connect-pluggy', {
            body: {
                action: 'createConnectToken',
                body: { options: { clientUserId } }
            }
        });

        if (error) throw new Error('Failed to create connect token');

        return data.accessToken;
    },

    /**
     * Fetches transactions for a specific account via Edge Function.
     */
    fetchTransactions: async (accountId: string): Promise<Partial<Transaction>[]> => {
        if (!supabase) throw new Error('Supabase client not initialized');

        const { data, error } = await supabase.functions.invoke('connect-pluggy', {
            body: {
                action: 'fetchTransactions',
                body: { accountId }
            }
        });

        if (error) throw new Error('Failed to fetch transactions');

        // Map Pluggy transactions to our App's Transaction type
        return data.results.map((pt: any) => ({
            description: pt.description,
            amount: Math.abs(pt.amount),
            date: pt.date ? pt.date.split('T')[0] : new Date().toISOString().split('T')[0],
            category: pt.category || 'Geral',
            establishment: pt.merchant ? pt.merchant.name : 'Desconhecido',
            type: pt.amount < 0 ? 'expense' : 'income',
            recurrence: 'none'
        }));
    }
};
