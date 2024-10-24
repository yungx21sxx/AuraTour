

import { prisma } from "~/server/service/prisma.service";
import { setCookie } from 'h3';
import jwt from 'jsonwebtoken';
import { verifySchema } from "~/server/schemas/auth.schemas";
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
                used: false,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        if (!verificationCode) {
            throw createError({ statusCode: 400, message: 'Код подтверждения не найден. Пожалуйста, запросите новый код.' });
        }

        // Лимит попыток ввода кода (например, 5 попыток)
        const now = new Date();
        const attempts = verificationCode.attempts || 0;
        const lastAttempt = verificationCode.lastAttempt || new Date(0);

        // Проверяем, не превышено ли максимальное количество попыток
        if (attempts >= 5) {
            // Проверяем, истекло ли время ограничения (например, 1 минута)
            if (now.getTime() - lastAttempt.getTime() < 60 * 1000) {
                throw createError({ statusCode: 429, message: 'Превышено количество попыток ввода кода. Пожалуйста, подождите минуту и попробуйте снова.' });
            } else {
                // Сбрасываем счетчик попыток после истечения времени ограничения
                await prisma.emailVerificationCode.update({
                    where: { id: verificationCode.id },
                    data: {
                        attempts: 0,
                    },
                });
            }
        }


        // Обновляем количество попыток и время последней попытки
        await prisma.emailVerificationCode.update({
            where: { id: verificationCode.id },
            data: {
                attempts: attempts + 1,
                lastAttempt: now,
            },
        });

        // Проверяем, не истек ли код
        if (verificationCode.expiresAt < now) {
            throw createError({ statusCode: 400, message: 'Срок действия кода истек. Пожалуйста, запросите новый код.' });
        }

        // Проверяем, совпадает ли код
        if (verificationCode.code !== code) {
            throw createError({ statusCode: 400, message: 'Неверный код подтверждения.' });
        }

        // Помечаем код как использованный
        await prisma.emailVerificationCode.update({
            where: { id: verificationCode.id },
            data: { used: true },
        });

        // Обновляем информацию о пользователе
        const userUpdateData = await prisma.user.update({
            where: { id: user.id },
            data: {
                emailVerified: true,
            },
        });
        // Генерируем JWT токен
        const token = generateToken(user.id)

        // Устанавливаем cookie с флагом httpOnly
        setCookie(event, 'auth_token', token, {
            httpOnly: true,
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24 * 7, // 7 дней
        });

        return {
            id: userUpdateData.id,
            name: userUpdateData.name,
            surname: userUpdateData.surname,
            email: userUpdateData.email,
            phone: userUpdateData.phone,
            role: userUpdateData.role,
            bonusPoints: userUpdateData.bonusPoints,
        };
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