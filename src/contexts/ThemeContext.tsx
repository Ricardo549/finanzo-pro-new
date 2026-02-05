import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { PALETTE_MAP } from '../constants/palette';

type Theme = 'light' | 'dark';
type ColorName = string;

interface ThemeContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    primaryColor: ColorName;
    setPrimaryColor: (color: ColorName) => void;
    secondaryColor: ColorName;
    setSecondaryColor: (color: ColorName) => void;
    resolvedTheme: Theme;
    language: 'pt-br' | 'en';
    setLanguage: (lang: 'pt-br' | 'en') => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [theme, setTheme] = useState<Theme>('light');
    const [primaryColor, setPrimaryColor] = useState<ColorName>('emerald');
    const [secondaryColor, setSecondaryColor] = useState<ColorName>('rose');
    const [resolvedTheme, setResolvedTheme] = useState<Theme>('light');
    const [language, setLanguage] = useState<'pt-br' | 'en'>('pt-br');

    useEffect(() => {
        setResolvedTheme(theme);
    }, [theme]);

    useEffect(() => {
        const root = document.documentElement;
        const color = PALETTE_MAP[primaryColor] || PALETTE_MAP.indigo;
        const colorSec = PALETTE_MAP[secondaryColor] || PALETTE_MAP.rose;

        root.style.setProperty('--primary-color', color);
        root.style.setProperty('--secondary-color', colorSec);

        if (resolvedTheme === 'dark') {
            root.classList.add('dark');
            root.style.setProperty('--background', '#000000');
            root.style.setProperty('--foreground', '#f0f0f0');
            root.style.setProperty('--card', '#121212');
            root.style.setProperty('--border', '#27272a');
            root.style.setProperty('--muted', '#a1a1aa');

            const metaThemeColor = document.querySelector('meta[name="theme-color"]');
            if (metaThemeColor) metaThemeColor.setAttribute('content', '#000000');
        } else {
            root.classList.remove('dark');
            root.style.setProperty('--background', '#f8fafc');
            root.style.setProperty('--foreground', '#0f172a');
            root.style.setProperty('--card', '#ffffff');
            root.style.setProperty('--border', '#e2e8f0');
            root.style.setProperty('--muted', '#64748b');

            const metaThemeColor = document.querySelector('meta[name="theme-color"]');
            if (metaThemeColor) metaThemeColor.setAttribute('content', color);
        }
    }, [primaryColor, secondaryColor, resolvedTheme]);

    return (
        <ThemeContext.Provider value={{
            theme,
            setTheme,
            primaryColor,
            setPrimaryColor,
            secondaryColor,
            setSecondaryColor,
            resolvedTheme,
            language,
            setLanguage
        }}>
            {children}
            <style>{`
        :root { 
            --primary-color: #4f46e5; 
            --secondary-color: #f43f5e; 
            --background: #f8fafc; /* Outdoor friendly Light */
            --foreground: #0f172a; 
            --card: #ffffff; 
            --border: #e2e8f0; 
            --muted: #64748b; 
        }
        .dark { 
            --background: #000000; /* OLED True Black */
            --foreground: #f0f0f0; /* Higher contrast text */
            --card: #121212; /* Material Surface */
            --border: #27272a; /* Zinc 800 */
            --muted: #a1a1aa; /* Zinc 400 */
        }
        body { background-color: var(--background); color: var(--foreground); transition: background-color 0.3s, color 0.3s; overflow-x: hidden; }
        
        /* Highlight Fields Request */
        input, select, textarea {
            border: 1px solid var(--border) !important;
            transition: all 0.2s;
        }
        input:focus, select:focus, textarea:focus {
            border-color: var(--primary-color) !important;
            box-shadow: 0 0 0 2px var(--primary-color) !important;
            opacity: 1 !important;
        }

        .bg-background { background-color: var(--background); }
        .bg-card { background-color: var(--card); }
        .text-foreground { color: var(--foreground); }
        .text-muted { color: var(--muted); }
        .border-border { border-color: var(--border); }
        .bg-primary { background-image: linear-gradient(135deg, var(--primary-color), var(--secondary-color)); background-color: var(--primary-color); }
        .text-primary { color: var(--primary-color); }
        .text-gradient { background: linear-gradient(135deg, var(--primary-color), var(--secondary-color)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .border-primary { border-color: var(--primary-color); }
        .bg-primary\\/10 { background-color: rgba(79, 70, 229, 0.1); }
        .bg-primary\\/20 { background-color: rgba(79, 70, 229, 0.2); }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin-slow { animation: spin-slow 8s linear infinite; }
        @keyframes bounce-short { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-3px); } }
        .animate-bounce-short { animation: bounce-short 1s ease-in-out infinite; }
      `}</style>
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
