import { defineEventHandler, createError, H3Event } from 'h3';
import { z } from 'zod';
import { prisma } from '~/server/service/prisma.service';
import {reviewSchema} from "~/server/schemas/reviews.schemas";

const reviewUpdateSchema = reviewSchema.partial();

export default defineEventHandler(async (event: H3Event) => {
    try {
        const id = Number(event.context.params?.reviewId);
        const body = await readBody(event);
        const parsedData = reviewUpdateSchema.parse(body);

        const user = event.context.user;
        const isAdminOrManager = user?.role === 'ADMIN' || user?.role === 'MANAGER';

        const existingReview = await prisma.review.findUnique({ where: { id } });

        if (!existingReview) {
            throw createError({ statusCode: 404, message: 'Отзыв не найден' });
        }

        if (!isAdminOrManager && existingReview.userId !== user.id) {
            throw createError({ statusCode: 403, message: 'Доступ запрещен' });
        }

        let dataToUpdate: any = {
            ...parsedData,
        };

        // Запрещаем изменять определенные поля
        if (!isAdminOrManager) {
            delete dataToUpdate.isAdminCreated;
            delete dataToUpdate.userId;
        }

        const updatedReview = await prisma.review.update({
            where: { id },
            data: dataToUpdate,
        });

        return { success: true, review: updatedReview };
    } catch (error) {
        console.log(error)
        if (error instanceof z.ZodError) {
            return {
                success: false,
                errors: error.errors.map((e) => e.message),
            };
        } else if (error.statusCode) {
            // Обработка ошибок, созданных с помощью createError
            return {
                success: false,
                message: error.message,
                statusCode: error.statusCode,
            };
        } else {
            return {
                success: false,
                message: 'Произошла ошибка на сервере',
            };
        }
    }
});