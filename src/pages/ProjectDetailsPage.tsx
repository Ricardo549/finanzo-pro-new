import React from 'react';
import { ChevronDown, PlusCircle, Settings, Trash2 } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Project } from '../../types';

interface ProjectDetailsPageProps {
    project: Project;
    onBack: () => void;
    onDelete: (id: string) => void;
}

export const ProjectDetailsPage: React.FC<ProjectDetailsPageProps> = ({ project, onBack, onDelete }) => (
    <div className="p-6 space-y-6 pb-24 animate-slide-up">
        <header className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-muted hover:text-foreground transition-colors"><ChevronDown className="rotate-90" size={24} /></button>
            <h2 className="text-lg font-black text-foreground truncate">{project.name}</h2>
        </header>
        <div className="flex flex-col items-center py-8">
            <div className="text-6xl mb-4">{project.icon}</div>
            <div className="text-3xl font-black text-foreground">R$ {project.currentAmount.toLocaleString()}</div>
            <div className="text-sm font-bold text-muted uppercase mt-1">de R$ {project.targetAmount.toLocaleString()}</div>
        </div>
        <Card className="space-y-4">
            <div className="flex justify-between text-xs font-bold"><span className="text-foreground">Progresso</span><span className="text-primary">{Math.round((project.currentAmount / project.targetAmount) * 100)}%</span></div>
            <ProgressBar progress={(project.currentAmount / project.targetAmount) * 100} />
            <p className="text-center text-xs text-muted leading-relaxed px-4">Continue aportando! Faltam apenas <strong className="text-foreground">R$ {(project.targetAmount - project.currentAmount).toLocaleString()}</strong> para atingir seu objetivo.</p>
        </Card>
        <div className="grid grid-cols-2 gap-3">
            <button onClick={() => alert('Simulação: Aportar valor')} className="p-4 bg-emerald-500/10 text-emerald-600 rounded-2xl font-black uppercase text-xs flex items-center justify-center gap-2 active:scale-95"><PlusCircle size={18} /> Aportar</button>
            <button onClick={() => alert('Simulação: Editar projeto')} className="p-4 bg-slate-100 dark:bg-slate-800 text-foreground rounded-2xl font-black uppercase text-xs flex items-center justify-center gap-2 active:scale-95"><Settings size={18} /> Editar</button>
        </div>
        <button onClick={() => { if (confirm('Excluir este projeto?')) { onDelete(project.id); onBack(); } }} className="w-full p-4 text-rose-500 font-bold text-xs uppercase tracking-widest hover:bg-rose-500/10 rounded-xl transition-colors">Excluir Projeto</button>
    </div>
);
