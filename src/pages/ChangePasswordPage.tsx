import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Card } from '../components/ui/Card';

interface ChangePasswordPageProps {
    onBack: () => void;
}

export const ChangePasswordPage: React.FC<ChangePasswordPageProps> = ({ onBack }) => {
    const [pass, setPass] = useState({ current: '', new: '', confirm: '' });
    const handleSave = () => {
        if (pass.new !== pass.confirm) return alert('Senhas não conferem!');
        alert('Senha atualizada com sucesso!');
        onBack();
    };
    return (
        <div className="p-6 space-y-6 pb-24 animate-slide-up">
            <header className="flex items-center gap-4">
                <button onClick={onBack} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-muted hover:text-foreground transition-colors"><ChevronDown className="rotate-90" size={24} /></button>
                <h2 className="text-2xl font-black text-foreground">Alterar Senha</h2>
            </header>
            <Card className="space-y-4">
                <div className="space-y-1"><label className="text-[10px] font-black text-muted uppercase">Senha Atual</label><input type="password" value={pass.current} onChange={e => setPass({ ...pass, current: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-900 border border-border p-3 rounded-xl outline-none" /></div>
                <div className="space-y-1"><label className="text-[10px] font-black text-muted uppercase">Nova Senha</label><input type="password" value={pass.new} onChange={e => setPass({ ...pass, new: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-900 border border-border p-3 rounded-xl outline-none" /></div>
                <div className="space-y-1"><label className="text-[10px] font-black text-muted uppercase">Confirmar Nova Senha</label><input type="password" value={pass.confirm} onChange={e => setPass({ ...pass, confirm: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-900 border border-border p-3 rounded-xl outline-none" /></div>
                <button onClick={handleSave} className="w-full bg-primary text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg active:scale-95 mt-4">Atualizar Senha</button>
            </Card>
        </div>
    );
};
