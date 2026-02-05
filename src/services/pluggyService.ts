import axios from 'axios';
import { Transaction } from '../types';

const PLUGGY_API_URL = 'https://api.pluggy.ai';

// In a real app, these should be fetched from your backend to avoid exposing secrets.
// For this client-side demo/MVP, we'll use env vars if available, or warn.
const CLIENT_ID = import.meta.env.VITE_PLUGGY_CLIENT_ID || '';
const CLIENT_SECRET = import.meta.env.VITE_PLUGGY_CLIENT_SECRET || '';

let accessToken: string | null = null;

export const pluggyService = {
    /**
     * Authenticates with Pluggy to get an access token.
     * efficient: reuses token if valid (in memory).
     */
    getAccessToken: async (): Promise<string> => {
        if (accessToken) return accessToken;

        if (!CLIENT_ID || !CLIENT_SECRET) {
            console.warn('Pluggy keys missing! Falling back to sandbox mode or error.');
            throw new Error('Missing Pluggy API Keys in .env');
        }

        try {
            const response = await axios.post(`${PLUGGY_API_URL}/auth`, {
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
            });
            accessToken = response.data.apiKey;
            return accessToken!;
        } catch (error) {
            console.error('Failed to auth with Pluggy:', error);
            throw error;
        }
    },

    /**
     * Creates a Connect Token to initialize the Pluggy Widget.
     */
    createConnectToken: async (): Promise<string> => {
        const token = await pluggyService.getAccessToken();
        const response = await axios.post(
            `${PLUGGY_API_URL}/connect_token`,
            { options: { clientUserId: 'user_' + Math.random().toString(36).substr(2, 9) } }, // Unique user ID
            { headers: { 'X-API-KEY': token } }
        );
        return response.data.accessToken;
    },

    /**
     * Fetches transactions for a specific account.
     */
    fetchTransactions: async (accountId: string): Promise<Partial<Transaction>[]> => {
        const token = await pluggyService.getAccessToken();
        const response = await axios.get(`${PLUGGY_API_URL}/transactions`, {
            headers: { 'X-API-KEY': token },
            params: { accountId }
        });

        // Map Pluggy transactions to our App's Transaction type
        return response.data.results.map((pt: any) => ({
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
