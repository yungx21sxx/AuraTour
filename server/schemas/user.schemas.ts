import {z} from "zod";

export const userCreateSchema = z.object({
    name: z.string().min(1, 'Имя обязательно для заполнения'),
    surname: z.string().optional(),
    email: z.string().email('Некорректный email').optional(),
    phone: z.string().min(1, 'Телефон обязателен для заполнения').optional(),
    role: z.enum(['ADMIN', 'MANAGER', 'TOURIST', 'LANDLORD']),
})

export const userUpdateSchema = z.object({
    name: z.string().min(1, 'Имя обязательно для заполнения'),
    surname: z.string().optional(),
    email: z.string().email('Некорректный email').optional(),
    phone: z.string().min(1, 'Телефон обязателен для заполнения').optional(),
    role: z.enum(['ADMIN', 'MANAGER', 'TOURIST', 'LANDLORD']).optional(),
    avatarId: z.number().int().optional(),
})