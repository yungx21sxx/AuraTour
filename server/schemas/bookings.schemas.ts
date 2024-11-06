import {z} from "zod";

export const bookingSchema = z.object({
    userName: z.string().min(2, 'Имя обязательно для заполнения'),
    status: z
        .enum(['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'])
        .optional(),
    userSurname: z.string(),
    userPhone: z.string().min(1, 'Телефон обязателен для заполнения'),
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
    daysCount: z.number().int(),
    listingId: z.number().int().positive('ID объекта должен быть положительным числом'),
    roomId: z.number().int().nullable().optional(),
    userId: z.number().nullable().optional(),
    bonusApplied: z.boolean(),
    bonusAppliedCount: z.number().optional(),
    totalPriceWithBonus: z.number().nonnegative().optional(),
    prepayWithBonus: z.number().nonnegative().optional(),
});

export const bookingUpdateSchema = z.object({
    userName: z.string().min(2, 'Имя обязательно для заполнения'),
    userSurname: z.string(),
    userPhone: z.string().min(1, 'Телефон обязателен для заполнения'),
    listingId: z.number().int().positive(),
    roomId: z.number().int().nullable().optional(),
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
    userId: z.number().nullable().optional(),
    bonusApplied: z.boolean(),
    bonusAppliedCount: z.number().optional(),
    totalPriceWithBonus: z.number().nonnegative().optional(),
    prepayWithBonus: z.number().nonnegative().optional(),
    daysCount: z.number().int(),
});