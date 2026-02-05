
import {
    ShoppingCart, Utensils, Smartphone, Gamepad2, GraduationCap,
    Scissors, Dumbbell, Users, Bus, Shirt, Car, Wine,
    Cigarette, Monitor, Plane, HeartPulse, Cat, Wrench,
    Home, Sofa, Gift, HeartHandshake, Dices, Coffee,
    Baby, Carrot, Apple, Plus,
    Briefcase, TrendingUp, Clock, Trophy, Coins, ArrowRightLeft
} from 'lucide-react';

export type TransactionType = 'expense' | 'income' | 'transfer';

export interface CategoryItem {
    id: string;
    label: string;
    icon: any;
    color?: string;
}

export const EXPENSE_CATEGORIES: CategoryItem[] = [
    { id: 'shopping', label: 'Compras', icon: ShoppingCart },
    { id: 'food', label: 'Comida', icon: Utensils },
    { id: 'phone', label: 'Telefone', icon: Smartphone },
    { id: 'entertainment', label: 'Entretenimento', icon: Gamepad2 },
    { id: 'education', label: 'Educação', icon: GraduationCap },
    { id: 'beauty', label: 'Beleza', icon: Scissors },
    { id: 'sports', label: 'Esportes', icon: Dumbbell },
    { id: 'social', label: 'Social', icon: Users },
    { id: 'transport', label: 'Transporte', icon: Bus },
    { id: 'clothing', label: 'Roupas', icon: Shirt },
    { id: 'car', label: 'Carro', icon: Car },
    { id: 'drinks', label: 'Bebidas', icon: Wine },
    { id: 'electronics', label: 'Eletrônicos', icon: Monitor },
    { id: 'travel', label: 'Viagem', icon: Plane },
    { id: 'health', label: 'Saúde', icon: HeartPulse },
    { id: 'pets', label: 'Pets', icon: Cat },
    { id: 'repairs', label: 'Reparos', icon: Wrench },
    { id: 'housing', label: 'Moradia', icon: Home },
    { id: 'home', label: 'Lar', icon: Sofa },
    { id: 'gifts', label: 'Presentes', icon: Gift },
    { id: 'donations', label: 'Doações', icon: HeartHandshake },
    { id: 'lottery', label: 'Loteria', icon: Dices },
    { id: 'snacks', label: 'Lanches', icon: Coffee },
    { id: 'kids', label: 'Filhos', icon: Baby },
    { id: 'vegetables', label: 'Vegetais', icon: Carrot },
    { id: 'fruits', label: 'Frutas', icon: Apple },
    { id: 'custom', label: 'Configurações', icon: Plus },
];

export const INCOME_CATEGORIES: CategoryItem[] = [
    { id: 'salary', label: 'Salário', icon: Briefcase },
    { id: 'investments', label: 'Investimentos', icon: TrendingUp },
    { id: 'part_time', label: 'Meio Período', icon: Clock },
    { id: 'awards', label: 'Prêmios', icon: Trophy },
    { id: 'others', label: 'Outros', icon: Coins },
];

export const TRANSFER_CATEGORIES: CategoryItem[] = [
    { id: 'transfer', label: 'Transferência', icon: ArrowRightLeft },
];
