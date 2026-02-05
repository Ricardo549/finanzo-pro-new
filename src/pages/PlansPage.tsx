import React from 'react';
import { ChevronDown, Award, Check } from 'lucide-react';
import { Card } from '../components/ui/Card';

interface PlansPageProps {
    onBack: () => void;
    onSelect: (plan: string) => void;
}

export const PlansPage: React.FC<PlansPageProps> = ({ onBack, onSelect }) => (
    <div className="p-6 space-y-6 pb-24 animate-slide-up">
        <header className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-muted hover:text-foreground transition-colors"><ChevronDown className="rotate-90" size={24} /></button>
            <h2 className="text-2xl font-black text-foreground">Planos</h2>
        </header>
        <div className="space-y-4">
            {[
                { name: 'Free', price: 'R$ 0,00', features: ['Consultas Básicas', '1 Projeto'], color: 'bg-slate-500' },
                { name: 'Pro (Brother)', price: 'R$ 29,90', features: ['IA Ilimitada', 'Projetos Ilimitados', 'Scanner Pro'], color: 'bg-primary', best: true }
            ].map(plan => (
                <Card key={plan.name} className={`relative border-2 ${plan.best ? 'border-primary' : 'border-transparent'}`}>
                    {plan.best && <div className="absolute -top-3 right-4 bg-primary text-white text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-widest">Recomendado</div>}
                    <div className={`w-12 h-12 ${plan.color} rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg`}><Award size={24} /></div>
                    <h3 className="text-xl font-black text-foreground">{plan.name}</h3>
                    <p className="text-sm font-bold text-muted mb-4">{plan.price}<span className="text-[10px] font-normal">/mês</span></p>
                    <ul className="space-y-2 mb-6">
                        {plan.features.map(f => <li key={f} className="flex items-center gap-2 text-xs font-medium text-muted"><Check size={14} className="text-emerald-500" /> {f}</li>)}
                    </ul>
                    <button onClick={() => onSelect(plan.name)} className={`w-full py-3 rounded-xl font-black uppercase text-xs tracking-widest transition-all active:scale-95 ${plan.best ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'bg-slate-100 dark:bg-slate-800 text-foreground'}`}>Assinar Agora</button>
                </Card>
            ))}
        </div>
    </div>
);
