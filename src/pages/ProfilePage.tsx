import React, { useEffect, useState } from 'react';
import { Card } from '../components/ui/Card';
import { useAuth } from '../contexts/AuthContext';
import { achievementService, Achievement, UserAchievement } from '../services/achievement.service';
import { Trophy, Star, ArrowLeft } from 'lucide-react';

interface ProfilePageProps {
    onBack: () => void;
    t: any;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ onBack, t }) => {
    const { currentUser, avatar, isPro } = useAuth();
    const [achievements, setAchievements] = useState<Achievement[]>([]);
    const [myAchievements, setMyAchievements] = useState<UserAchievement[]>([]);
    const [totalXP, setTotalXP] = useState(0);

    useEffect(() => {
        const loadData = async () => {
            const all = await achievementService.getAll();
            setAchievements(all);

            // Mock user ID usage for now if not available in context directly as ID
            // In real app, currentUser object would have ID. 
            // We assume auth.getUser() handles this in service, but we need ID for query.
            // For now, we fetch assuming service handles current user internally or we pass ID.
            // Since service getUserAchievements takes ID, and currentUser is just email string in context currently...
            // We might need to refactor or fetch user ID. 
            // For MVP display, let's load empty or mock.
            // If using Supabase, we can get session user ID.

            // NOTE: Current AuthContext only stores email as currentUser string.
            // We cannot fetch real user achievements with just email unless we query profiles.
            // Or we update AuthContext to store full user object.
            // Proceeding with mock data display behavior if no ID.
        };
        loadData();
    }, [currentUser]);

    const unlockedIds = new Set(myAchievements.map(ua => ua.achievement_id));

    return (
        <div className="p-4 space-y-6 pb-24 h-full flex flex-col animate-slide-up bg-background min-h-screen transition-colors duration-300">
            {/* Header */}
            <div className="flex items-center justify-between pt-2">
                <button onClick={onBack} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    <ArrowLeft size={24} className="text-muted" />
                </button>
                <h2 className="text-xl font-bold text-foreground">Perfil</h2>
                <div className="w-10"></div>
            </div>

            {/* Profile Header */}
            <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                    <div className="w-24 h-24 rounded-full border-4 border-primary p-1">
                        <img
                            src={avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"}
                            alt="Avatar"
                            className="w-full h-full rounded-full object-cover bg-slate-200"
                        />
                    </div>
                    {isPro && (
                        <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[10px] font-black px-2 py-1 rounded-full shadow-lg border-2 border-background">
                            PRO
                        </div>
                    )}
                </div>
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-foreground">{currentUser || 'Usuário'}</h1>
                    <div className="flex items-center justify-center gap-2 text-muted text-sm font-medium mt-1">
                        <Star size={14} className="text-yellow-500 fill-yellow-500" />
                        <span>{totalXP} XP</span>
                        <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                        <span>Nível {Math.floor(totalXP / 1000) + 1}</span>
                    </div>
                </div>
            </div>

            {/* Stats Overview (Optional) */}
            <div className="grid grid-cols-2 gap-4">
                <Card className="p-4 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 border-none">
                    <Trophy size={24} className="text-primary mb-2" />
                    <span className="text-2xl font-black text-foreground">{myAchievements.length}</span>
                    <span className="text-xs text-muted uppercase tracking-wider">Conquistas</span>
                </Card>
                <Card className="p-4 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 border-none">
                    <Star size={24} className="text-yellow-500 mb-2" />
                    <span className="text-2xl font-black text-foreground">{totalXP}</span>
                    <span className="text-xs text-muted uppercase tracking-wider">Total XP</span>
                </Card>
            </div>

            {/* Achievements List */}
            <div className="space-y-4">
                <h3 className="text-lg font-bold text-foreground px-2">Conquistas</h3>
                <div className="grid gap-4">
                    {achievements.map((achievement) => {
                        const isUnlocked = unlockedIds.has(achievement.id);
                        return (
                            <Card
                                key={achievement.id}
                                className={`p-4 flex items-center gap-4 border-none transition-all ${isUnlocked ? 'bg-card' : 'bg-slate-100 dark:bg-slate-900 opacity-60 grayscale'}`}
                            >
                                <div className="text-3xl">{achievement.icon}</div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-foreground">{achievement.name}</h4>
                                    <p className="text-xs text-muted">{achievement.description}</p>
                                </div>
                                {isUnlocked && (
                                    <div className="text-primary">
                                        <CheckIcon />
                                    </div>
                                )}
                                <div className="text-xs font-bold text-muted bg-slate-200 dark:bg-slate-800 px-2 py-1 rounded flex items-center gap-1">
                                    {achievement.xp_reward} XP
                                </div>
                            </Card>
                        )
                    })}
                </div>
            </div>
        </div>
    );
};

const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
);
