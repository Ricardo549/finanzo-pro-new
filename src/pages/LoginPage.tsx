import React, { useState } from 'react';
import { TrendingUp, Sparkles, Globe, ArrowRight } from 'lucide-react';

interface LoginPageProps {
    onLogin: (email: string) => void;
    onUpgrade: () => void;
    onGoogleLogin: () => void;
    language: string;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onUpgrade, onGoogleLogin, language }) => {
    const [email, setEmail] = useState('brother@finanzo.pro');

    return (
        <div className="min-h-screen bg-[#020617] flex flex-col p-10 justify-center animate-slide-up text-white overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,#1e293b,transparent_70%)] opacity-40 pointer-events-none"></div>
            <div className="mb-14 text-center relative z-10">
                <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-2xl shadow-emerald-500/30 mb-8 mx-auto">
                    <TrendingUp size={40} />
                </div>
                <h1 className="text-4xl font-black tracking-tighter mb-2">Finanzo <span className="text-emerald-500">Pro</span></h1>
                <p className="text-slate-400 font-medium text-sm">{language === 'pt-br' ? 'Controle Total com Segurança Bancária' : 'Total Control with Bank Security'}</p>
            </div>
            <div className="space-y-4 max-w-sm mx-auto w-full relative z-10 bg-slate-900/50 p-8 rounded-[2rem] border border-slate-800 backdrop-blur-sm">
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-3 mb-4">
                    <Sparkles size={16} className="text-emerald-500" />
                    <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">{language === 'pt-br' ? 'Acesso Pro Detectado' : 'Pro Access Detected'}</span>
                </div>

                <button onClick={() => onLogin(email)} className="w-full bg-white text-slate-900 p-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-slate-100 transition-colors mb-4 shadow-lg shadow-white/5 active:scale-95">
                    <Globe size={18} /> {language === 'pt-br' ? 'CONTINUAR COM GOOGLE' : 'CONTINUE WITH GOOGLE'}
                </button>

                <div className="flex items-center gap-4 text-xs font-bold text-slate-500 uppercase tracking-widest my-6">
                    <div className="h-px bg-slate-800 flex-1"></div>
                    <span>{language === 'pt-br' ? 'Ou Credenciais' : 'Or Credentials'}</span>
                    <div className="h-px bg-slate-800 flex-1"></div>
                </div>

                <input type="email" placeholder="E-mail" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-slate-900/80 border border-slate-700 p-4 rounded-xl outline-none text-white focus:ring-2 focus:ring-emerald-500/40 transition-all placeholder:text-slate-600" />
                <input type="password" placeholder="Senha" defaultValue="********" className="w-full bg-slate-900/80 border border-slate-700 p-4 rounded-xl outline-none text-white focus:ring-2 focus:ring-emerald-500/40 transition-all placeholder:text-slate-600" />

                <button onClick={() => onLogin(email)} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white p-4 rounded-xl font-black text-sm uppercase tracking-widest shadow-lg shadow-emerald-500/20 active:scale-[0.98] transition-all mt-4 flex items-center justify-center gap-2">
                    {language === 'pt-br' ? 'Acessar Painel' : 'Access Dash'} <ArrowRight size={18} />
                </button>

                <button onClick={onUpgrade} className="w-full text-emerald-500 font-bold text-[10px] uppercase tracking-widest opacity-80 hover:opacity-100 transition-opacity mt-6">
                    {language === 'pt-br' ? 'Não tem conta? Comece Grátis' : 'No account? Start Free'}
                </button>
            </div>
        </div>
    );
};
