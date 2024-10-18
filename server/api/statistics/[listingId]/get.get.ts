import { prisma } from "~/server/service/prisma.service";
import {calculateOccupancyCoefficientOptimized} from "~/server/service/statistics.service";

export default defineEventHandler(async (event) => {
    const listingId = Number(event.context.params?.listingId);
    const query = getQuery(event);
    const startDate = query.startDate ? new Date(query.startDate as string) : null;
    const endDate = query.endDate ? new Date(query.endDate as string) : null;

    if (!listingId || isNaN(listingId)) {
        return sendError(event, new Error('Invalid listing ID'));
    }

    const bookings = await prisma.booking.findMany({
        where: { listingId: listingId },
        select: {
            checkOut: true,
            checkIn: true
        }
    })


    let occupancyCoefficient = 0
    if (bookings.length > 0) {
        occupancyCoefficient = calculateOccupancyCoefficientOptimized(bookings, startDate, endDate);
    }
    try {
        const whereClause: any = {
            listingId,
        };

        if (startDate && endDate) {
            whereClause.date = {
                gte: startDate,
                lte: endDate,
            };
        }

        const statistics = await prisma.listingStatistic.findMany({
            where: whereClause,
            orderBy: {
                date: 'asc',
            },
        });
        return {
            data: {statistics, occupancyCoefficient },
        };
    } catch (error) {
        return sendError(event, error);
    }
});