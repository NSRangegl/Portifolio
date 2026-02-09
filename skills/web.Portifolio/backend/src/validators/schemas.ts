import { z } from 'zod';

export const createProjectSchema = z.object({
    title: z.string()
        .min(3, 'Título deve ter no mínimo 3 caracteres')
        .max(100, 'Título muito longo (máximo 100 caracteres)'),
    description: z.string()
        .min(10, 'Descrição deve ter no mínimo 10 caracteres')
        .max(1000, 'Descrição muito longa (máximo 1000 caracteres)'),
    tags: z.array(z.string())
        .min(1, 'Adicione pelo menos uma tag')
        .max(10, 'Máximo 10 tags permitidas'),
});

export const loginSchema = z.object({
    username: z.string()
        .min(3, 'Usuário deve ter no mínimo 3 caracteres'),
    password: z.string()
        .min(6, 'Senha deve ter no mínimo 6 caracteres'),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
