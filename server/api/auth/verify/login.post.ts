import { setCookie } from 'h3';
import jwt from 'jsonwebtoken';
import {prisma} from "~/server/service/prisma.service";
import {verifySchema} from "~/server/schemas/auth.schemas";
import { z } from 'zod';

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event);
        const { email, code } = verifySchema.parse(body);

        // Ищем пользователя
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            throw createError({ statusCode: 404, message: 'Пользователь не найден' });
        }

        // Проверяем код
        const verificationCode = await prisma.emailVerificationCode.findFirst({
            where: {
                userId: user.id,
                code,
                used: false,
                expiresAt: {
                    gt: new Date(),
                },
            },
        });

        if (!verificationCode) {
            throw createError({ statusCode: 400, message: 'Неверный или истекший код' });
        }

        // Лимит попыток ввода кода (например, 5 попыток)
        if (verificationCode.attempts >= 5) {
            throw createError({ statusCode: 429, message: 'Превышено количество попыток ввода кода' });
        }

        // Проверяем, не истек ли лимит времени между попытками (например, 1 минута)
        const now = new Date();
        if (now.getTime() - verificationCode.lastAttempt.getTime() < 60 * 1000) {
            throw createError({ statusCode: 429, message: 'Слишком частые попытки ввода кода' });
        }

        // Обновляем количество попыток и время последней попытки
        await prisma.emailVerificationCode.update({
            where: { id: verificationCode.id },
            data: {
                attempts: verificationCode.attempts + 1,
                lastAttempt: now,
            },
        });

        // Помечаем код как использованный
        await prisma.emailVerificationCode.update({
            where: { id: verificationCode.id },
            data: { used: true },
        });

        await prisma.user.update({
            where: {id: user.id},
            data: {
                emailVerified: true
            }
        })
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'your_jwt_secret' as string, { expiresIn: '7d' });

        // Устанавливаем cookie с флагом httpOnly
        setCookie(event, 'auth_token', token, {
            httpOnly: true,
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24 * 7, // 7 дней
        });

        return { message: 'Вы успешно вошли в систему' };
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