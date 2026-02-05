import { z } from 'zod';

export const LoginSchema = z.object({
    email: z.string().email('E-mail inválido'),
    password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
});

export const RegisterSchema = z.object({
    name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
    email: z.string().email('E-mail inválido'),
    password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
    cpf: z.string().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'CPF inválido (use o formato 000.000.000-00)').optional(), // Optional for Free tier, enforced in UI for Pro
    isPro: z.boolean(),
    acceptedTerms: z.literal(true, {
        message: 'Você deve aceitar os termos de uso', // Correct property for custom message
    }),
});

export const ProjectSchema = z.object({
    name: z.string().min(3, 'Nome do projeto muito curto'),
    targetAmount: z.number().positive('O valor deve ser positivo'),
    currentAmount: z.number().min(0, 'O valor atual não pode ser negativo'),
});

export const TransactionSchema = z.object({
    description: z.string().min(3, 'Descrição muito curta'),
    amount: z.number(), // Can be negative for expenses
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data inválida (YYYY-MM-DD)'),
    category: z.string().min(1, 'Categoria é obrigatória'),
});
