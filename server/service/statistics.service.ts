import {prisma} from "~/server/service/prisma.service";

interface Booking {
    checkIn: Date;
    checkOut: Date;
}

type MetricValue = 'views' | 'likes' | 'favorites' | 'bookings' | 'revenue' | "submits"

export function calculateOccupancyCoefficientOptimized(
    bookings: Booking[],
    periodStart: Date | null,
    periodEnd: Date | null
): number {
    if (bookings.length === 0) {
        // Нет бронирований, все дни свободны
        return Infinity;
    }

    // Если период не указан, определяем его по бронированиям
    if (!periodStart) {
        periodStart = new Date(
            Math.min(...bookings.map((booking) => booking.checkIn.getTime()))
        );
    }

    if (!periodEnd) {
        periodEnd = new Date(
            Math.max(...bookings.map((booking) => booking.checkOut.getTime()))
        );
    }

    const periodStartTime = periodStart.getTime();
    const periodEndTime = periodEnd.getTime();

    if (periodStartTime >= periodEndTime) {
        throw new Error("Некорректный период: начало периода должно быть раньше конца периода.");
    }

    // Общее количество дней в периоде
    const totalPeriodDays =
        (periodEndTime - periodStartTime) / (1000 * 60 * 60 * 24);

    // Используем Set для хранения уникальных занятых дней
    const occupiedDays = new Set<number>();

    for (const booking of bookings) {
        // Находим перекрытие бронирования с периодом
        const bookingStartTime = Math.max(booking.checkIn.getTime(), periodStartTime);
        const bookingEndTime = Math.min(booking.checkOut.getTime(), periodEndTime);

        if (bookingStartTime < bookingEndTime) {
            // Вычисляем занятые дни
            const startDayIndex = Math.floor(
                (bookingStartTime - periodStartTime) / (1000 * 60 * 60 * 24)
            );
            const endDayIndex = Math.ceil(
                (bookingEndTime - periodStartTime) / (1000 * 60 * 60 * 24)
            );

            for (let day = startDayIndex; day < endDayIndex; day++) {
                occupiedDays.add(day);
            }
        }
    }

    const totalOccupiedDays = occupiedDays.size;
    const totalFreeDays = totalPeriodDays - totalOccupiedDays;

    // Избегаем деления на ноль
    const occupancyCoefficient =
        totalOccupiedDays === 0 ? Infinity : totalFreeDays / totalOccupiedDays;

    return occupancyCoefficient;
}

export async function upsertListingStatistic(listingId: number, metric: MetricValue, value: number) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const statistic = await prisma.listingStatistic.upsert({
        where: {
            listingId_date: {
                listingId,
                date: today,
            },
        },
        update: {
            [metric]: {
                increment: value,
            },
        },
        create: {
            listingId,
            date: today,
            [metric]: value,
        },
    });

    return statistic;
}