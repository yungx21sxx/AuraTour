import {H3Event} from "h3";
import {prisma} from "~/server/service/prisma.service";

export default defineEventHandler(async (event: H3Event) => {
    const id = Number(event.context.params.userId);
    const user = event.context.user; // Предполагая, что пользователь хранится в контексте
    const isAdminOrManager = user?.role === 'ADMIN' || user?.role === 'MANAGER';

    if (!isAdminOrManager) {
        throw createError({ statusCode: 403, message: 'Forbidden: Access is denied' });
    }

    const userData = await prisma.user.findUnique({
        where: { id: id },
        include: {
            BonusTransaction: true,
            userBookings: true,
            ownerListings: true,
        }
    });

    if (!userData) {
        throw createError({ statusCode: 404, statusMessage: 'Пользователь не найден' });
    }

    return userData;

})