import { supabase } from './supabase';

export interface Achievement {
    id: string;
    code: string;
    name: string;
    description: string;
    icon: string;
    xp_reward: number;
}

export interface UserAchievement {
    id: string;
    achievement_id: string;
    unlocked_at: string;
    achievement?: Achievement;
}

const ENABLE_MOCKS = import.meta.env.VITE_ENABLE_MOCKS === 'true';

export const achievementService = {
    getAll: async (): Promise<Achievement[]> => {
        if (!ENABLE_MOCKS && supabase) {
            const { data, error } = await supabase
                .from('achievements')
                .select('*')
                .order('xp_reward', { ascending: true });

            if (error) throw new Error(error.message);
            return data as Achievement[];
        }

        // Mocks
        return [
            { id: '1', code: 'FIRST_LOGIN', name: 'Primeiro Passo', description: 'Fez o primeiro login', icon: '🚀', xp_reward: 100 },
            { id: '2', code: 'SAVER_Level_1', name: 'Poupador', description: 'Guardou dinheiro pela primeira vez', icon: '💰', xp_reward: 200 },
            { id: '3', code: 'STREAK_7', name: 'Fogo', description: '7 dias seguidos', icon: '🔥', xp_reward: 500 },
        ];
    },

    getUserAchievements: async (userId: string): Promise<UserAchievement[]> => {
        if (!ENABLE_MOCKS && supabase) {
            const { data, error } = await supabase
                .from('user_achievements')
                .select('*, achievement:achievements(*)')
                .eq('user_id', userId);

            if (error) throw new Error(error.message);
            return data as UserAchievement[];
        }

        // Mocks
        return [];
    },

    unlock: async (userId: string, achievementCode: string): Promise<UserAchievement | null> => {
        if (!ENABLE_MOCKS && supabase) {
            // Find achievement ID first
            const { data: achievement } = await supabase
                .from('achievements')
                .select('id')
                .eq('code', achievementCode)
                .single();

            if (!achievement) return null;

            // Insert
            const { data, error } = await supabase
                .from('user_achievements')
                .insert([{ user_id: userId, achievement_id: achievement.id }])
                .select()
                .single();

            if (error) {
                // Ignore unique constraint violation (already unlocked)
                if (error.code === '23505') return null;
                throw new Error(error.message);
            }
            return data;
        }

        return { id: 'mock', achievement_id: '1', unlocked_at: new Date().toISOString() };
    }
};
