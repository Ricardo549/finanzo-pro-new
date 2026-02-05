import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '../services/auth.service';
import { supabase } from '../services/supabase';

interface User {
    email: string;
    name?: string;
}

interface AuthContextType {
    currentUser: string | null;
    isAuthenticated: boolean;
    userId: string | null;
    isPro: boolean;
    pendingGoogleUser: { name: string; email: string } | null;
    avatar: string | null;
    login: (email: string) => Promise<void>;
    logout: () => void;
    setPendingGoogleUser: (user: { name: string; email: string } | null) => void;
    setAvatar: (avatar: string) => void;
    handleAvatarChange: (file: File) => void;
    setIsPro: (isPro: boolean) => void;
    upgradeToPro: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [userId, setUserId] = useState<string | null>(null);
    const [currentUser, setCurrentUser] = useState<string | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isPro, setIsPro] = useState<boolean>(false);
    const [pendingGoogleUser, setPendingGoogleUserRaw] = useState<{ name: string; email: string } | null>(null);
    const [avatar, setAvatarState] = useState<string | null>(() => {
        // Load avatar on mount (lazy initialization)
        if (typeof window !== 'undefined') {
            return localStorage.getItem('userAvatar');
        }
        return null;
    });

    const login = async (email: string) => {
        // In a real app this would likely take password too or use the authService fully
        // Reusing the logic seen in App.tsx
        const response = await authService.login({ email, password: 'password123' });
        setCurrentUser(response.user.email);
        setUserId(response.user.id);
        setIsAuthenticated(true);

        // Fetch Profile from Supabase
        if (supabase) {
            const { data: profile } = await supabase
                .from('profiles')
                .select('*')
                .eq('email', email)
                .single();

            if (profile) {
                setIsPro(profile.is_pro);
                if (profile.avatar_url) setAvatarState(profile.avatar_url);
            }
        }
    };

    const logout = () => {
        setIsAuthenticated(false);
        setCurrentUser(null);
        setUserId(null);
    };

    const setPendingGoogleUser = (user: { name: string; email: string } | null) => {
        setPendingGoogleUserRaw(user);
    };

    const upgradeToPro = () => {
        setIsPro(true);
    };

    const setAvatar = (base64: string) => {
        setAvatarState(base64);
        localStorage.setItem('userAvatar', base64);
    }

    const handleAvatarChange = (file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64 = reader.result as string;
            setAvatar(base64);
        };
        reader.readAsDataURL(file);
    };

    return (
        <AuthContext.Provider value={{
            currentUser,
            userId,
            isAuthenticated,
            isPro,
            pendingGoogleUser,
            avatar,
            login,
            logout,
            setPendingGoogleUser,
            setAvatar,
            handleAvatarChange,
            setIsPro,
            upgradeToPro
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
