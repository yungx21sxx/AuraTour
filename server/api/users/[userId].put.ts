// server/api/users/[id].patch.ts

import { defineEventHandler, readBody, createError } from 'h3';
import { prisma } from '~/server/service/prisma.service';
import { z } from 'zod';
import { userUpdateSchema } from "~/server/schemas/user.schemas";

export default defineEventHandler(async (event) => {
    const userId = parseInt(event.context.params.userId, 10);

    if (isNaN(userId)) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Invalid user ID',
        });
    }

    // Получаем текущего аутентифицированного пользователя
    const currentUser = event.context?.user;

    if (!currentUser) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Unauthorized',
        });
    }

    // Проверяем права доступа
    const isAdminOrManager = currentUser.role === 'ADMIN' || currentUser.role === 'MANAGER';
    const isEditingOwnAccount = currentUser.id === userId;

    if (!isAdminOrManager && !isEditingOwnAccount) {
        throw createError({
            statusCode: 403,
            statusMessage: 'Forbidden',
        });
    }

    // Получаем данные пользователя из базы данных
    const user = await prisma.user.findUnique({
        where: { id: userId },
    });

    if (!user) {
        throw createError({
            statusCode: 404,
            statusMessage: 'User not found',
        });
    }

    // Если пользователь пытается обновить профиль, но у него есть незавершённое изменение email
    if (isEditingOwnAccount && !isAdminOrManager) {
        const pendingEmailChange = await prisma.emailVerificationCode.findFirst({
            where: {
                userId: userId,
                expiresAt: {
                    gt: new Date(),
                },
            },
        });

        if (pendingEmailChange) {
            throw createError({
                statusCode: 403,
                statusMessage: 'You must confirm your new email before updating your profile',
            });
        }
    }

    // Читаем тело запроса и валидируем его
    const body = await readBody(event);
    const parsedData = userUpdateSchema.safeParse(body);


    if (!parsedData.success) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Validation Error',
            data: parsedData.error.errors,
        });
    }

    const data = parsedData.data;

    // Обработка изменения роли
    if (data.role && data.role !== user.role) {
        if (isEditingOwnAccount) {
            // Пользователи могут менять роль только между TOURIST и LANDLORD
            const validRoleChanges: Record<string, string> = {
                TOURIST: 'LANDLORD',
                LANDLORD: 'TOURIST',
            };

            if (validRoleChanges[user.role] !== data.role) {
                throw createError({
                    statusCode: 403,
                    statusMessage: 'You can only change your role between TOURIST and LANDLORD',
                });
            }
        }
    }

    // Обработка изменения электронной почты
    let emailVerificationRequired = false;
    let newEmail: string | undefined = undefined;

    if (data.email && data.email !== user.email) {
        if (isEditingOwnAccount) {
            throw createError({
                statusCode: 400,
                message: 'Новую почту необходимо подтвердить, чтобы не потерять доступ к аккаунту.',
            });
        }
    }

    // Обработка изменения аватарки
    if (data.avatarId) {
        // Проверяем, существует ли фото с переданным ID
        const photo = await prisma.photo.findUnique({
            where: { id: data.avatarId },
        });

        if (!photo) {
            throw createError({
                statusCode: 404,
                statusMessage: 'Photo not found',
            });
        }
    }


    try {
        if (data.email && data.email === user.email) {
            delete data.email;
        }

        if (data.phone && data.phone === user.phone) {
            delete data.phone;
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data,
        });
        return {
            message: 'Данные успешно обновленны!',
            data: updatedUser,
        };
    } catch (error: any) {
        // Обработка ошибок, например, уникальных ограничений
        if (error.code === 'P2002') {
            throw createError({
                statusCode: 409,
                statusMessage: 'Unique constraint failed',
                data: error.meta,
            });
        }

        throw createError({
            statusCode: 500,
            statusMessage: 'Internal Server Error',
            data: error.message,
        });
    }
});
