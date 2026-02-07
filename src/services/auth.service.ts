import { api } from './api';
import { LoginDTO, RegisterDTO, AuthResponse, User } from '@/types';
import { LoginSchema, RegisterSchema } from './schemas';
import { tokenService } from './token.service';
import { supabase } from './supabase';

const MOCK_DELAY = 800;
const ENABLE_MOCKS = import.meta.env.VITE_ENABLE_MOCKS === 'true';

export const authService = {
    login: async (data: LoginDTO): Promise<AuthResponse> => {
        const validation = LoginSchema.safeParse(data);
        if (!validation.success) {
            throw new Error(validation.error.errors[0].message);
        }

        if (!ENABLE_MOCKS) {
            if (!supabase) throw new Error('Supabase client not initialized. Check your environment variables.');

            const { data: authData, error } = await supabase.auth.signInWithPassword({
                email: data.email,
                password: data.password || '',
            });

            if (error) throw new Error(error.message);
            if (!authData.user || !authData.session) throw new Error('Erro ao autenticar');

            // Fetch additional user profile data if needed from a 'profiles' table
            const user: User = {
                id: authData.user.id,
                name: authData.user.user_metadata.name || 'Usuário',
                email: authData.user.email || '',
                isPro: authData.user.user_metadata.is_pro || false,
                role: 'user',
                avatar: authData.user.user_metadata.avatar_url,
            };

            const token = authData.session.access_token;
            tokenService.setToken(token);
            return { user, token };
        }

        // --- MOCK IMPLEMENTATION ---
        return new Promise((resolve) => {
            setTimeout(() => {
                const isGoogle = data.email.includes('google');
                const user: User = {
                    id: 'u_123',
                    name: isGoogle ? 'Ricardo (Google)' : 'Usuário Finanzo (Dev)',
                    email: data.email,
                    isPro: data.isPro || false,
                    role: 'user',
                    avatar: 'https://i.pravatar.cc/150?u=123'
                };

                const token = 'mock_jwt_token_' + Date.now();
                tokenService.setToken(token);
                resolve({ user, token });
            }, MOCK_DELAY);
        });
    },

    register: async (data: RegisterDTO): Promise<AuthResponse> => {
        const validation = RegisterSchema.safeParse(data);
        if (!validation.success) {
            throw new Error(validation.error.errors[0].message);
        }

        if (!ENABLE_MOCKS) {
            if (!supabase) throw new Error('Supabase client not initialized. Check your environment variables.');

            const { data: authData, error } = await supabase.auth.signUp({
                email: data.email,
                password: data.password || 'temp123456', // Supabase needs password even for Oauth placeholders
                options: {
                    data: {
                        name: data.name,
                        is_pro: data.isPro,
                        cpf: data.cpf,
                    }
                }
            });

            if (error) throw new Error(error.message);
            if (!authData.user) throw new Error('Erro ao criar conta');

            // Note: If email confirmation is enabled in Supabase, session might be null here.
            // We assume for this stage it returns session or we handle flow.
            const token = authData.session?.access_token || 'pending_email_verification';

            const user: User = {
                id: authData.user.id,
                name: data.name,
                email: data.email,
                isPro: data.isPro,
                role: 'user',
            };

            if (authData.session) tokenService.setToken(token);
            return { user, token };
        }

        // --- MOCK IMPLEMENTATION ---
        return new Promise((resolve) => {
            setTimeout(() => {
                const user: User = {
                    id: 'u_new_' + Date.now(),
                    name: data.name,
                    email: data.email,
                    isPro: data.isPro,
                    role: 'user',
                };

                const token = 'mock_jwt_token_' + Date.now();
                tokenService.setToken(token);
                resolve({ user, token });
            }, MOCK_DELAY);
        });
    },

    logout: async () => {
        if (!ENABLE_MOCKS) {
            if (!supabase) throw new Error('Supabase client not initialized. Check your environment variables.');
            await supabase.auth.signOut();
        }
        tokenService.removeToken();
    },

    isAuthenticated: (): boolean => {
        return !!tokenService.getToken();
    }
};
