import {z} from "zod";

export const bookingSchema = z.object({
    name: z.string().min(1, 'Имя обязательно для заполнения'),
    surname: z.string().optional(),
    email: z.string().email('Некорректный email').optional(),
    phone: z.string().min(1, 'Телефон обязателен для заполнения').optional(),
    checkIn: z.string().refine((date) => !isNaN(Date.parse(date)), {
        message: 'Некорректная дата заезда',
    }),
    checkOut: z.string().refine((date) => !isNaN(Date.parse(date)), {
        message: 'Некорректная дата выезда',
    }),
    adults: z.number().int().min(1, 'Количество взрослых должно быть не менее 1'),
    childrens: z.number().int().nonnegative().optional(),
    comment: z.string().optional(),
    transfer: z.boolean().optional(),
    transferComment: z.string().optional(),
    totalPrice: z.number().int().positive('Общая стоимость должна быть положительным числом'),
    prepay: z.number().int().nonnegative('Предоплата не может быть отрицательной'),
    listingId: z.number().int().positive('ID объекта должен быть положительным числом'),
    roomId: z.number().int().positive().optional(),
});

export const bookingUpdateSchema = z.object({
    listingId: z.number().int().positive().optional(),
    roomId: z.number().int().positive().nullable().optional(),
    status: z
        .enum(['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'])
        .optional(),
    // Другие поля, которые можно редактировать
    checkIn: z.string().refine((date) => !isNaN(Date.parse(date)), {
        message: 'Некорректная дата заезда',
    }).optional(),
    checkOut: z.string().refine((date) => !isNaN(Date.parse(date)), {
        message: 'Некорректная дата выезда',
    }).optional(),
    adults: z.number().int().min(1).optional(),
    childrens: z.number().int().nonnegative().optional(),
    comment: z.string().optional(),
    transfer: z.boolean().optional(),
    transferComment: z.string().optional(),
    totalPrice: z.number().int().positive().optional(),
    prepay: z.number().int().nonnegative().optional(),
});