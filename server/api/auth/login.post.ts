import { prisma } from "~/server/service/prisma.service";
import {sendEmailVerificationCode} from "~/server/utils/mail.utils";
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
        const code = Math.floor(100000 + Math.random() * 900000).toString();

        // Устанавливаем время истечения кода (15 минут)
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

        // Сохраняем код в базе данных
        await prisma.emailVerificationCode.create({
            data: {
                code,
                userId: user.id,
                expiresAt,
            },
        });

        // Отправляем код на почту
        try {
            await sendEmailVerificationCode(email, code);
        } catch (mailError) {
            // Если отправка не удалась, удаляем временного пользователя и код
            console.log(mailError)
            await prisma.emailVerificationCode.deleteMany({ where: { userId: user.id } });
            await prisma.user.delete({ where: { id: user.id } });
            throw createError({ statusCode: 500, message: 'Не удалось отправить код подтверждения. Попробуйте позже.' });
        }

        return { message: 'Код подтверждения отправлен на вашу почту' };
    } catch (error) {
        // Обработка ошибок валидации
        if (error instanceof z.ZodError) {
            throw createError({
                statusCode: 400,
                message: error.errors.map((err) => err.message).join(', '),
            });
        }
        throw error;
    }
});