import React, { useState } from 'react';
import { User, Camera, Award, Palette, Sun, Moon, ShieldCheck, ChevronRight, Globe, RefreshCw, LogOut, MessageSquare, AlertTriangle } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { PALETTE_MAP } from '../constants/palette';
import { DeleteAccountModal } from '../components/DeleteAccountModal';

interface SettingsPageProps {
    primaryColor: string;
    setPrimaryColor: (c: string) => void;
    secondaryColor: string;
    setSecondaryColor: (c: string) => void;
    theme: string;
    setTheme: (t: string) => void;
    language: 'pt-br' | 'en';
    setLanguage: (l: 'pt-br' | 'en') => void;
    t: any;
    onLogout: () => void;
    onChangePass: () => void;
    avatar: string | null;
    onAvatarChange: (file: File) => void;
    onViewTerms: () => void;
    onViewPrivacy: () => void;
    onContactSupport: (message: string) => void;
    onDeleteAccount: (reason: string) => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ primaryColor, setPrimaryColor, secondaryColor, setSecondaryColor, theme, setTheme, language, setLanguage, t, onLogout, onChangePass, avatar, onAvatarChange, onViewTerms, onViewPrivacy, onContactSupport, onDeleteAccount }) => {
    const [biometrics, setBiometrics] = useState(true);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const handleSupportClick = () => {
        const message = prompt("Descreva seu problema ou sugestão:");
        if (message && message.trim()) {
            onContactSupport(message);
        }
    };

    return (
        <div className="p-6 space-y-8 pb-24 animate-slide-up">
            <header className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-black text-foreground">{t.title}</h2>
                    <p className="text-muted text-sm font-medium">{t.sub}</p>
                </div>
                <label className="relative w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center text-primary border border-primary/20 cursor-pointer overflow-hidden group hover:opacity-80 transition-all active:scale-95">
                    {avatar ? (
                        <img src={avatar} className="w-full h-full object-cover" alt="User Avatar" />
                    ) : (
                        <User size={24} />
                    )}
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => { if (e.target.files?.[0]) onAvatarChange(e.target.files[0]); }} />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Camera size={16} className="text-white" />
                    </div>
                </label>
            </header>

            <div className="p-4 bg-primary rounded-3xl text-white shadow-xl shadow-primary/20 flex items-center justify-between">
                <div>
                    <h4 className="font-black uppercase text-xs tracking-widest flex items-center gap-2"><Award size={14} /> {t.level}</h4>
                    <p className="text-[10px] opacity-90 mt-1">Benefícios vip ativos na firma.</p>
                </div>
                <div className="bg-white/20 px-3 py-1.5 rounded-xl border border-white/30 backdrop-blur-md">
                    <span className="text-[9px] font-black uppercase">PRO</span>
                </div>
            </div>

            <div className="space-y-6">
                <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-muted uppercase tracking-widest flex items-center gap-2"><Palette size={14} /> {t.style}</h4>
                    <Card className="space-y-6">
                        <div className="space-y-3">
                            <label className="text-xs font-bold text-foreground">{t.theme}</label>
                            <div className="grid grid-cols-2 gap-2">
                                {[{ id: 'light', label: t.theme_light, icon: Sun }, { id: 'dark', label: t.theme_dark, icon: Moon }].map((th) => (
                                    <button key={th.id} onClick={() => setTheme(th.id)} className={`flex items-center justify-center gap-2 p-3 rounded-2xl border transition-all active:scale-95 ${theme === th.id ? 'bg-primary/10 border-primary text-primary' : 'bg-slate-50 dark:bg-slate-800 border-border text-muted hover:bg-slate-100 dark:hover:bg-slate-700'}`}>
                                        <th.icon size={16} /> <span className="text-[10px] font-black uppercase">{th.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-3">
                            <label className="text-xs font-bold text-foreground">Cor 1 (Primária)</label>
                            <div className="flex flex-wrap gap-4">
                                {Object.keys(PALETTE_MAP).map((p) => (
                                    <button key={`pri-${p}`} onClick={() => setPrimaryColor(p)} style={{ backgroundColor: PALETTE_MAP[p] }} className={`w-10 h-10 rounded-full transition-all active:scale-90 ${primaryColor === p ? 'ring-4 ring-offset-2 ring-primary scale-110' : 'hover:scale-105 opacity-70 hover:opacity-100'}`} />
                                ))}
                            </div>
                        </div>
                        <div className="space-y-3 pt-4 border-t border-border">
                            <label className="text-xs font-bold text-foreground">Cor 2 (Secundária)</label>
                            <div className="flex flex-wrap gap-4">
                                {Object.keys(PALETTE_MAP).map((p) => (
                                    <button key={`sec-${p}`} onClick={() => setSecondaryColor(p)} style={{ backgroundColor: PALETTE_MAP[p] }} className={`w-10 h-10 rounded-full transition-all active:scale-90 ${secondaryColor === p ? 'ring-4 ring-offset-2 ring-primary scale-110' : 'hover:scale-105 opacity-70 hover:opacity-100'}`} />
                                ))}
                            </div>
                        </div>
                    </Card>
                </div>
                <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-muted uppercase tracking-widest flex items-center gap-2"><ShieldCheck size={14} /> {t.security}</h4>
                    <Card className="space-y-4">
                        <div className="flex items-center justify-between py-1 cursor-pointer" onClick={() => setBiometrics(!biometrics)}>
                            <span className="text-xs font-bold">{t.biometrics}</span>
                            <div className={`w-10 h-6 rounded-full transition-colors relative ${biometrics ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-700'}`}><div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${biometrics ? 'right-1' : 'left-1'}`}></div></div>
                        </div>
                        <button className="w-full flex items-center justify-between py-1 border-t border-border pt-4 text-left active:opacity-70 transition-opacity" onClick={onChangePass}><span className="text-xs font-bold">{t.pass}</span><ChevronRight size={16} className="text-muted" /></button>
                    </Card>
                </div>
                <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-muted uppercase tracking-widest flex items-center gap-2"><Globe size={14} /> {t.lang}</h4>
                    <Card className="flex items-center justify-between py-4 cursor-pointer active:bg-slate-50 dark:active:bg-slate-800 transition-colors" onClick={() => setLanguage(language === 'pt-br' ? 'en' : 'pt-br')}>
                        <span className="text-xs font-bold">{t.current_lang}</span>
                        <div className="flex items-center gap-1 text-primary"><RefreshCw size={14} className="animate-spin-slow" /><span className="text-[9px] font-black uppercase">{language === 'pt-br' ? 'Trocar' : 'Switch'}</span></div>
                    </Card>
                </div>

                <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-muted uppercase tracking-widest flex items-center gap-2"><ShieldCheck size={14} /> Legal</h4>
                    <Card className="space-y-4">
                        <button className="w-full flex items-center justify-between py-1 text-left active:opacity-70 transition-opacity" onClick={onViewTerms}>
                            <span className="text-xs font-bold">Termos de Uso</span>
                            <ChevronRight size={16} className="text-muted" />
                        </button>
                        <div className="border-t border-border"></div>
                        <button className="w-full flex items-center justify-between py-1 text-left active:opacity-70 transition-opacity" onClick={onViewPrivacy}>
                            <span className="text-xs font-bold">Política de Privacidade</span>
                            <ChevronRight size={16} className="text-muted" />
                        </button>
                    </Card>
                </div>

                <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-rose-500 uppercase tracking-widest flex items-center gap-2"><AlertTriangle size={14} /> Suporte & Perigo</h4>
                    <Card className="space-y-4">
                        <button className="w-full flex items-center justify-between py-1 text-left active:opacity-70 transition-opacity hover:text-primary" onClick={handleSupportClick}>
                            <span className="text-xs font-bold flex items-center gap-2"><MessageSquare size={16} /> Fale Conosco</span>
                            <ChevronRight size={16} className="text-muted" />
                        </button>
                        <div className="border-t border-border"></div>
                        <button className="w-full flex items-center justify-between py-1 text-left active:opacity-70 transition-opacity text-rose-500 hover:text-rose-600" onClick={() => setShowDeleteModal(true)}>
                            <span className="text-xs font-bold flex items-center gap-2"><LogOut size={16} /> Excluir Minha Conta</span>
                            <ChevronRight size={16} className="text-rose-300" />
                        </button>
                    </Card>
                </div>

                <button onClick={onLogout} className="w-full py-5 bg-slate-100 dark:bg-slate-800 text-muted rounded-3xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 mt-4 active:scale-95 transition-all hover:bg-slate-200 dark:hover:bg-slate-700">
                    <LogOut size={18} /> {t.logout}
                </button>
            </div>

            <DeleteAccountModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={(reason) => {
                    setShowDeleteModal(false);
                    onDeleteAccount(reason);
                }}
            />
        </div>
    );
};
