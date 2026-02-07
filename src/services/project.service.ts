import { api } from './api';
import { Project } from '@/types';
import { ProjectSchema } from './schemas';
import { supabase } from './supabase';

const MOCK_DELAY = 600;
const ENABLE_MOCKS = import.meta.env.VITE_ENABLE_MOCKS === 'true';

export const projectService = {
    getAll: async (): Promise<Project[]> => {
        if (!ENABLE_MOCKS) {
            if (!supabase) throw new Error('Supabase client not initialized. Check your environment variables.');

            const { data, error } = await supabase
                .from('projects')
                .select('*');

            if (error) throw new Error(error.message);

            // Map Snake_case (DB) -> CamelCase (App)
            return data.map((p: any) => ({
                id: p.id,
                name: p.name,
                targetAmount: p.target_amount,
                currentAmount: p.current_amount,
                icon: p.icon
            })) as Project[];
        }

        // --- MOCK IMPLEMENTATION ---
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([
                    { id: '1', name: 'Reserva Emergência', targetAmount: 20000, currentAmount: 14500, icon: '🛡️' },
                    { id: '2', name: 'Carro Novo', targetAmount: 85000, currentAmount: 32000, icon: '🚗' }
                ]);
            }, MOCK_DELAY);
        });
    },

    create: async (project: Omit<Project, 'id'>): Promise<Project> => {
        const validation = ProjectSchema.safeParse(project);
        if (!validation.success) throw new Error(validation.error.errors[0].message);

        if (!ENABLE_MOCKS) {
            if (!supabase) throw new Error('Supabase client not initialized. Check your environment variables.');

            // Get current user
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Usuário não autenticado');

            // Map CamelCase (App) -> Snake_case (DB)
            const dbPayload = {
                user_id: user.id,
                name: project.name,
                target_amount: project.targetAmount,
                current_amount: project.currentAmount,
                icon: project.icon
            };

            const { data, error } = await supabase
                .from('projects')
                .insert([dbPayload])
                .select()
                .single();

            if (error) throw new Error(error.message);

            // Map back for return
            return {
                id: data.id,
                name: data.name,
                targetAmount: data.target_amount,
                currentAmount: data.current_amount,
                icon: data.icon
            } as Project;
        }

        // --- MOCK IMPLEMENTATION ---
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    id: Math.random().toString(36).substr(2, 9),
                    ...project
                });
            }, MOCK_DELAY);
        });
    },

    update: async (id: string, updates: Partial<Project>): Promise<Project> => {
        if (!ENABLE_MOCKS) {
            if (!supabase) throw new Error('Supabase client not initialized. Check your environment variables.');

            // Map CamelCase (App) -> Snake_case (DB) if needed
            const dbPayload: any = {};
            if (updates.name) dbPayload.name = updates.name;
            if (updates.targetAmount) dbPayload.target_amount = updates.targetAmount;
            if (updates.currentAmount !== undefined) dbPayload.current_amount = updates.currentAmount;
            if (updates.icon) dbPayload.icon = updates.icon;

            const { data, error } = await supabase
                .from('projects')
                .update(dbPayload)
                .eq('id', id)
                .select()
                .single();

            if (error) throw new Error(error.message);

            return {
                id: data.id,
                name: data.name,
                targetAmount: data.target_amount,
                currentAmount: data.current_amount,
                icon: data.icon
            } as Project;
        }

        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    id,
                    name: updates.name || 'Updated Project',
                    targetAmount: updates.targetAmount || 1000,
                    currentAmount: updates.currentAmount || 0,
                    icon: updates.icon || '📝'
                } as Project);
            }, MOCK_DELAY);
        });
    },

    delete: async (id: string): Promise<void> => {
        if (!ENABLE_MOCKS) {
            if (!supabase) throw new Error('Supabase client not initialized. Check your environment variables.');

            const { error } = await supabase
                .from('projects')
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
