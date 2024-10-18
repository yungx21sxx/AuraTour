// server/api/users/[id]/bonus/deduct.post.ts

import { defineEventHandler, readBody, createError } from 'h3';
import { prisma } from '~/server/service/prisma.service';
import {bonusUpdateSchema} from "~/server/schemas/bonus.schemas";

export default defineEventHandler(async (event) => {
    const  id  = event.context.params.userId;
    const userId = parseInt(id, 10);

    if (isNaN(userId)) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Invalid user ID',
        });
    }

    const currentUser = event.context?.user;

    if (!currentUser) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Unauthorized',
        });
    }

    // Проверка роли
    if (currentUser.role !== 'ADMIN' && currentUser.role !== 'MANAGER') {
        throw createError({
            statusCode: 403,
            statusMessage: 'Forbidden: Only ADMIN and MANAGER can deduct bonuses',
        });
    }

    // Валидация тела запроса
    const body = await readBody(event);
    const parsedData = bonusUpdateSchema.safeParse(body);

    if (!parsedData.success) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Validation Error',
            data: parsedData.error.errors,
        });
    }

    const { amount, description } = parsedData.data;

    // Проверка существования пользователя
    const user = await prisma.user.findUnique({
        where: { id: userId },
    });

    if (!user) {
        throw createError({
            statusCode: 404,
            statusMessage: 'User not found',
        });
    }

    // Проверка, достаточно ли бонусных баллов для списания
    if (user.bonusPoints < amount) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Insufficient bonus points',
        });
    }

    // Начало транзакции для обеспечения целостности данных
    const transaction = await prisma.$transaction(async (prisma) => {
        // Создание записи в BonusTransaction с отрицательным значением amount
        const bonusTransaction = await prisma.bonusTransaction.create({
            data: {
                userId,
                amount: -amount, // Отрицательное значение для списания
                description: description ? description : 'Начисление бонусов.',
            },
        });

        // Обновление бонусных баллов пользователя
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                bonusPoints: {
                    decrement: amount,
                },
            },
        });

        return { bonusTransaction, updatedUser };
    });

    return {
        message: 'Bonus points deducted successfully',
        data: transaction,
    };
});