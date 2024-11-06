import type {IListingPricePeriod} from "~/modules/Listing/types/response.types";

export function calculatePrices(pricePeriods: IListingPricePeriod[], minPrice: number, checkIn: Date | null, checkOut: Date | null): {dailyPrice: number, totalPrice: number, daysCount: number} | null {

    if (!checkOut || !checkIn || !pricePeriods) {
        return null
    }
    //@ts-ignore
    const start = new Date(checkIn);
    //@ts-ignore
    const end = new Date(checkOut);
    let totalDays = 0;
    let totalPrice = 0;

    for (const period of pricePeriods) {
        const periodStart = new Date(period.startDate);
        const periodEnd = new Date(period.endDate);

        // Найти пересечение периода бронирования с периодом цены
        const latestStart = new Date(Math.max(periodStart.getTime(), start.getTime()));
        const earliestEnd = new Date(Math.min(periodEnd.getTime(), end.getTime()));
        const delta = (earliestEnd.getTime() - latestStart.getTime()) / (1000 * 60 * 60 * 24);

        // Если есть пересечение, добавляем к общему количеству дней и общей цене
        if (delta > 0) {
            const days = Math.ceil(delta); // Включаем обе границы
            totalDays += days;
            totalPrice += days * period.price;
        }
    }

    // Если общее количество дней меньше, чем забронированный период (минимальная цена не использовалась)
    const bookingDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    if (totalDays < bookingDays) {
        const remainingDays = bookingDays - totalDays;
        totalDays += remainingDays;
        totalPrice += remainingDays * minPrice;
    }

    const dailyPrice = totalPrice / totalDays;
    return {
        dailyPrice: Math.trunc(dailyPrice),
        totalPrice,
        daysCount: totalDays
    };
}

export function countDays(startDate: Date, endDate: Date): number {
    const oneDay = 24 * 60 * 60 * 1000; // Количество миллисекунд в одном дне
    const differenceInTime = endDate.getTime() - startDate.getTime();
    return Math.round(differenceInTime / oneDay);
}