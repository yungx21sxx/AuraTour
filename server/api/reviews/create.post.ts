import { defineEventHandler, createError, H3Event } from 'h3';
import { reviewSchema } from '~/server/schemas/reviews.schemas';
import { prisma } from '~/server/service/prisma.service';
import {z} from "zod";

export default defineEventHandler(async (event: H3Event) => {
    try {
        const body = await readBody(event);
        const parsedData = reviewSchema.parse(body);

        const user = event.context.user; // Предполагая, что пользователь хранится в контексте

        const isAdminOrManager = user?.role === 'ADMIN' || user?.role === 'MANAGER';

        if (!user && !isAdminOrManager) {
            throw createError({ statusCode: 401, message: 'Необходима авторизация' });
        }
        
        let dataToSave: any = {
            ...parsedData,
            isAdminCreated: isAdminOrManager,
        };

        if (!isAdminOrManager) {
            // Обычный пользователь
            dataToSave.userId = user.id;
        } else {
            // Администратор или менеджер может указать имя пользователя
            if (!parsedData.userName) {
                throw createError({ statusCode: 400, message: 'Необходимо указать имя пользователя' });
            }
        }

        const review = await prisma.review.create({ data: dataToSave });

        return { success: true, review };
    } catch (error) {
        if (error instanceof z.ZodError) {
            return {
                success: false,
                errors: error.errors.map((e) => e.message),
            };
        } else {
            return {
                success: false,
                message: error.message || 'Произошла ошибка',
            };
        }
    }
});
