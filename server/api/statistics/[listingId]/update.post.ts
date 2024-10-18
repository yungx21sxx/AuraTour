import { prisma } from "~/server/service/prisma.service";
import {upsertListingStatistic} from "~/server/service/statistics.service";

interface UpdateStatisticsBody {
    metric: 'views' | 'likes' | 'favorites' | 'bookings' | 'revenue' | 'submits';
    value: number;
}

export default defineEventHandler(async (event) => {
    const listingId = Number(event.context.params?.listingId);

    if (!listingId || isNaN(listingId)) {
        return sendError(event, createError({ statusCode: 400, statusMessage: 'Invalid listing ID' }));
    }

    // Проверяем, существует ли Listing с данным listingId
    const listing = await prisma.listing.findUnique({
        where: { id: listingId },
    });


    if (!listing) {
        return sendError(event, createError({ statusCode: 404, statusMessage: 'Listing not found' }));
    }

    // Получаем данные из тела запроса
    const body = await readBody<UpdateStatisticsBody>(event);
    const { metric, value } = body;

    if (
        !metric ||
        !['views', 'likes', 'favorites', 'bookings', 'revenue', 'submits'].includes(metric) ||
        typeof value !== 'number'
    ) {
        return sendError(event, createError({ statusCode: 400, statusMessage: 'Invalid metric or value' }));
    }

    // Получаем текущую дату (без времени)


    try {
        // Обновляем или создаем запись статистики
        const statistic = await upsertListingStatistic(listingId, metric, value);

        return {
            data: statistic,
        };
    } catch (error) {
        return sendError(event, error);
    }
});