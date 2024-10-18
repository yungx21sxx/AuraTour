import {createError, H3Event} from "h3";
import {prisma} from "~/server/service/prisma.service";

export default defineEventHandler(async (event: H3Event) => {
    const id = Number(event.context.params?.reviewId);
    const user = event.context.user;
    const isAdminOrManager = user?.role === 'ADMIN' || user?.role === 'MANAGER';
    const existingReview = await prisma.review.findUnique({ where: { id } });

    if (!existingReview) {
        throw createError({ statusCode: 404, message: 'Отзыв не найден' });
    }

    if (!isAdminOrManager && existingReview.userId !== user.id) {
        throw createError({ statusCode: 403, message: 'Доступ запрещен' });
    }
    await prisma.review.delete({where: { id: id }});
    return {success: true, deletedReview: existingReview};
})