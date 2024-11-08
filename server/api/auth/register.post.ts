import {generateVerificationCode, sendEmailVerificationCode} from "~/server/utils/mail.utils";
import { prisma } from "~/server/service/prisma.service";
import { registerSchema } from "~/server/schemas/auth.schemas";
import { z } from 'zod';


export default defineEventHandler(async (event) => {

        const body = await readBody(event);

        const { email, name, surname, role = 'TOURIST', phone } = registerSchema.parse(body);

        // Проверяем, существует ли уже временный пользователь с таким email
        let user = await prisma.user.findUnique({ where: { email } });

        if (user) {
            throw createError({ statusCode: 400, message: 'Пользователь с таким email уже существует, попробуйте войти в аккаунт.' });
        }
        // Если пользователь временный или не существует, продолжаем
        if (!user) {
            // Создаем временного пользователя
            user = await prisma.user.create({
                data: {
                    email,
                    name,
                    surname,
                    role,
                    phone,
                    isTemporary: false,
                },
            });
        }

        // Генерируем код
        const code = await generateVerificationCode(user.id);

        // Пытаемся отправить код на почту
        try {
            await sendEmailVerificationCode(email, code);
        } catch (mailError) {
            // Если отправка не удалась, удаляем временного пользователя и код
            await prisma.emailVerificationCode.deleteMany({ where: { userId: user.id } });
            await prisma.user.delete({ where: { id: user.id } });
            throw createError({ statusCode: 500, message: 'Не удалось отправить код подтверждения. Попробуйте позже.' });
        }

        return { email: user.email };
});