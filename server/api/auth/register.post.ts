import {sendEmailVerificationCode} from "~/server/utils/mail.utils";
import { prisma } from "~/server/service/prisma.service";
import { registerSchema } from "~/server/schemas/auth.schemas";
import { z } from 'zod';

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event);
        const { email, name, surname } = registerSchema.parse(body);

        // Проверяем, существует ли уже временный пользователь с таким email
        let user = await prisma.user.findUnique({ where: { email } });

        if (user && !user.isTemporary) {
            throw createError({ statusCode: 400, message: 'Пользователь с таким email уже существует' });
        }

        // Если пользователь временный или не существует, продолжаем
        if (!user) {
            // Создаем временного пользователя
            user = await prisma.user.create({
                data: {
                    email,
                    name,
                    surname,
                    isTemporary: true,
                },
            });
        }

        // Генерируем код
        const code = Math.floor(100000 + Math.random() * 900000).toString();

        // Устанавливаем время истечения кода
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

        // Сохраняем код в базе данных
        await prisma.emailVerificationCode.create({
            data: {
                code,
                userId: user.id,
                expiresAt,
            },
        });

        // Пытаемся отправить код на почту
        try {
            await sendEmailVerificationCode(email, code);
        } catch (mailError) {
            // Если отправка не удалась, удаляем временного пользователя и код
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