import {H3Event} from "h3";
import { prisma } from "~/server/service/prisma.service";
import { z } from "zod"

const sendEmailVerificationSchema = z.object({
    newEmail: z.string().email(),
});

export default defineEventHandler(async (event) => {
    // Получаем ID пользователя из параметров URL
    const  id  = event.context.params?.userId;
    const userId = parseInt(id, 10);

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
    const isEditingOwnAccount = currentUser.id === userId;

    if (!isEditingOwnAccount) {
        throw createError({
            statusCode: 403,
            statusMessage: 'Forbidden',
        });
    }

    // Читаем тело запроса и валидируем его
    const body = await readBody(event);
    const parsedData = sendEmailVerificationSchema.safeParse(body);

    if (!parsedData.success) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Validation Error',
            data: parsedData.error.errors,
        });
    }

    const { newEmail } = parsedData.data;

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

    // Проверяем, если новый email уже используется
    const existingUser = await prisma.user.findUnique({
        where: { email: newEmail },
    });

    if (existingUser && existingUser.id !== userId) {
        throw createError({
            statusCode: 409,
            statusMessage: 'Пользователь с такой почтой уже зарегестрирован.',
        });
    }

    // Обработка изменения электронной почты
    let emailVerificationRequired = false;

    if (newEmail && newEmail === user.email) {
        throw createError({
            statusCode: 400,
            statusMessage: 'No changes detected',
        });
    } else {
        emailVerificationRequired = true;
    }

    if (emailVerificationRequired) {
        // Генерация кода подтверждения
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

        // Отправка кода подтверждения на новый email
        await sendEmailVerificationCode(newEmail, code);

        // Обновление пользователя: установка нового email и флага подтверждения
        await prisma.user.update({
            where: { id: userId },
            data: {
                email: newEmail,
                emailVerified: false,
            },
        });

        return {
            message: 'Verification code sent to new email',
        };
    }
});

