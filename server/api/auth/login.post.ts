import { prisma } from "~/server/service/prisma.service";
import {generateVerificationCode, sendEmailVerificationCode} from "~/server/utils/mail.utils";
import { loginSchema } from '~/server/schemas/auth.schemas'
import { z } from 'zod';

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event);
        const { email } = loginSchema.parse(body);
        // Проверяем, существует ли пользователь
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            throw createError({ statusCode: 404, message: 'Пользователь не найден' });
        }

        // Генерируем код
        const code = await generateVerificationCode(user.id);

        // Отправляем код на почту
        try {
            await sendEmailVerificationCode(email, code);
        } catch (mailError) {
            await prisma.emailVerificationCode.deleteMany({ where: { userId: user.id } });
            throw createError({ statusCode: 500, message: 'Не удалось отправить код подтверждения. Попробуйте позже.' });
        }

        return { email: user.email };
    } catch (error) {
        if (error instanceof z.ZodError) {
            throw createError({
                statusCode: 400,
                message: error.map((err) => err.message).join(', '),
            });
        }
        throw error;
    }
});