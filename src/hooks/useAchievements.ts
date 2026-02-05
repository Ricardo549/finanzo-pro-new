import { useEffect, useRef } from 'react';
import { achievementService } from '../services/achievement.service';
import { Transaction, Project } from '../../types';
import { triggerSchoolPride } from '../utils/confetti';
import { soundManager } from '../utils/soundManager';

export const useAchievements = (
    userId: string | null,
    transactions: Transaction[],
    projects: Project[]
) => {
    const checkedRef = useRef<Set<string>>(new Set());

    useEffect(() => {
        if (!userId) return;

        const checkAchievements = async () => {
            // 1. First Login (Simple check: always try to unlock if we haven't checked this session)
            if (!checkedRef.current.has('FIRST_LOGIN')) {
                const unlocked = await achievementService.unlock(userId, 'FIRST_LOGIN');
                if (unlocked) {
                    // Trigger notification/confetti
                    triggerSchoolPride();
                    soundManager.play('unlock');
                    alert(`🏆 Conquista Desbloqueada: Primeiro Passo!`);
                }
                checkedRef.current.add('FIRST_LOGIN');
            }

            // 2. Scheduler/Saver
            if (transactions.length > 0 && !checkedRef.current.has('SAVER_Level_1')) {
                // Check if any transaction is an investment or savings
                const hasSavings = transactions.some(t =>
                    t.category === 'Investimento' ||
                    t.category === 'Investimentos' ||
                    t.description.toLowerCase().includes('guard')
                );

                if (hasSavings) {
                    const unlocked = await achievementService.unlock(userId, 'SAVER_Level_1');
                    if (unlocked) {
                        triggerSchoolPride();
                        soundManager.play('unlock');
                        alert(`🏆 Conquista Desbloqueada: Poupador Iniciante!`);
                    }
                    checkedRef.current.add('SAVER_Level_1');
                }
            }

            // 3. Project Creator
            if (projects.length > 0 && !checkedRef.current.has('DREAMER')) {
                // Define DREAMER badge if not exists, or map to existing. 
                // We only defined 3 badges in SQL. Let's stick to those.
            }
        };

        checkAchievements();
    }, [userId, transactions, projects]);
};
