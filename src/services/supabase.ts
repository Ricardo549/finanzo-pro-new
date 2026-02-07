import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Only initialize if keys are present to avoid runtime crashes in dev without keys
// Only initialize if keys are present and valid to avoid runtime crashes
const isValidUrl = (url: string) => {
    try { return Boolean(new URL(url)); } catch (e) { return false; }
};

export const supabase = (supabaseUrl && supabaseKey && isValidUrl(supabaseUrl))
    ? createClient(supabaseUrl, supabaseKey)
    : null;

if (!supabase && import.meta.env.VITE_ENABLE_MOCKS !== 'true') {
    console.warn('⚠️ Supabase not initialized and mocks are disabled. Application will not function correctly without env vars.');
}

export const isSupabaseConfigured = () => !!supabase;
