import { z } from 'zod';

export const loginSchema = z.object({
    email: z.string().email({ message: 'Некорректный формат email' }),
});

export const verifySchema = z.object({
    email: z.string().email({ message: 'Некорректный формат email' }),
    code: z.string().length(6, { message: 'Код должен содержать 6 цифр' }),
});

export const registerSchema = z.object({
    email: z.string().email({ message: 'Некорректный формат email' }),
    name: z.string().min(1, { message: 'Имя обязательно для заполнения' }),
    surname: z.string(),
    phone: z.string().optional(),
    role: z.enum([ 'TOURIST', 'LANDLORD']).optional(),
});