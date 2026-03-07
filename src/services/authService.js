import { supabase } from './api';

export const authService = {
    login: async (email, password) => {
        return supabase.auth.signInWithPassword({ email, password });
    },
    register: async (email, password) => {
        return supabase.auth.signUp({
            email,
            password,
            options: { emailRedirectTo: window.location.origin }
        });
    },
    logout: async () => {
        return supabase.auth.signOut();
    },
    getSession: async () => {
        return supabase.auth.getSession();
    },
    onAuthStateChange: (callback) => {
        return supabase.auth.onAuthStateChange(callback);
    }
};
