import React from 'react';
import { Award, Sparkles, Coffee, Check, ArrowUpRight, ArrowDownLeft, Target } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { ProgressBar } from '../components/ui/ProgressBar';
import { EmptyState } from '../components/ui/EmptyState';
import { Project } from '../../types';

interface DashboardProps {
    t: any;
    isPro: boolean;
    projects: Project[];
    onAcceptChallenge: () => void;
    onViewAll: () => void;
    onProjectClick: (id: string) => void;
    onCreateProject: () => void;
    challenge: { text: string, amount: number, completed: boolean };
}

export const Dashboard: React.FC<DashboardProps> = ({ t, isPro, projects, onAcceptChallenge, onViewAll, onProjectClick, onCreateProject, challenge }) => {
    return (
        <div className="p-6 space-y-6 pb-24 animate-slide-up">
            <header className="flex items-center justify-between">
                <div>
                    <h2 className="text-muted text-xs font-black uppercase tracking-widest">{t.greet}</h2>
                    <p className="text-2xl font-black text-foreground">{t.sub}</p>
                </div>
                <div className="flex items-center gap-2 bg-primary/10 px-3 py-1.5 rounded-full border border-primary/20">
                    <Award size={14} className="text-primary" />
                    <span className="text-[9px] font-black text-foreground uppercase">Membro Pro</span>
                </div>
            </header>
            {!challenge.completed ? (
                <Card className="bg-primary text-white border-none shadow-primary/20 relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-3"><Sparkles size={18} className="text-amber-300" /><span className="text-xs font-black uppercase tracking-wider opacity-80">{t.mission}</span></div>
                        <h3 className="text-lg font-bold mb-2">{t.coffee_title}</h3>
                        <p className="text-white/80 text-sm mb-4 leading-relaxed">{challenge.text}</p>
                        <button onClick={onAcceptChallenge} className="bg-white/20 backdrop-blur-md border border-white/30 text-white px-4 py-2 rounded-xl text-xs font-black active:scale-95 transition-all">{t.coffee_cta}</button>
                    </div>
                    <Coffee className="absolute -right-6 -bottom-6 opacity-10 rotate-12" size={160} />
                </Card>
            ) : (
                <Card className="bg-emerald-500/10 border-emerald-500/20 flex items-center gap-3 p-4">
                    <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center"><Check size={20} /></div>
                    <div><p className="text-xs font-black text-emerald-600 uppercase">Missão Cumprida!</p><p className="text-[10px] text-muted">Volte amanhã para mais.</p></div>
                </Card>
            )}
            <div className="grid grid-cols-2 gap-4">
                <Card className="flex flex-col gap-1 border-emerald-500/10 bg-emerald-500/[0.02]"><ArrowUpRight size={20} className="text-emerald-500 mb-1" /><span className="text-[10px] text-muted font-black uppercase">{t.income}</span><span className="text-lg font-black text-foreground">R$ 12.450</span></Card>
                <Card className="flex flex-col gap-1 border-rose-500/10 bg-rose-500/[0.02]"><ArrowDownLeft size={20} className="text-rose-500 mb-1" /><span className="text-[10px] text-muted font-black uppercase">{t.expense}</span><span className="text-lg font-black text-foreground">R$ 4.120</span></Card>
            </div>
            <section className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="font-black text-foreground flex items-center gap-2 text-xs uppercase"><Target size={18} className="text-primary" /> {t.projects}</h3>
                    <button onClick={onViewAll} className="text-[10px] font-bold text-primary hover:underline">{t.view_all}</button>
                </div>
                {projects.length > 0 ? (
                    projects.map(p => (
                        <Card key={p.id} className="active:scale-[0.99] transition-transform cursor-pointer" onClick={() => onProjectClick(p.id)}>
                            <div className="flex items-center gap-4 mb-3">
                                <div className="text-2xl">{p.icon}</div>
                                <div className="flex-1"><h4 className="font-bold text-foreground text-sm">{p.name}</h4><p className="text-[10px] text-muted font-bold uppercase">Meta: R$ {p.targetAmount.toLocaleString()}</p></div>
                                <span className="text-sm font-black text-primary">{Math.round((p.currentAmount / p.targetAmount) * 100)}%</span>
                            </div>
                            <ProgressBar progress={(p.currentAmount / p.targetAmount) * 100} />
                        </Card>
                    ))
                ) : (
                    <EmptyState
                        title="Sem Projetos Ativos"
                        message="Bora criar sua primeira meta e começar a evoluir de verdade?"
                        actionLabel="Criar Meta"
                        onAction={onCreateProject}
                    />
                )}
            </section>
        </div>
    );
};
