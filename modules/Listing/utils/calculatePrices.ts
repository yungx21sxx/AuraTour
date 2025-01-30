import type {IListingPricePeriod} from "~/modules/Listing/types/response.types";

export function calculatePrices(pricePeriods: IListingPricePeriod[], minPrice: number, checkIn: Date | null, checkOut: Date | null): {dailyPrice: number, totalPrice: number, daysCount: number} | null {

    if (!checkOut || !checkIn) {
        return null;
    }

    checkIn = new Date(checkIn);
    checkOut = new Date(checkOut);

    //@ts-ignore
    const dayInMilliseconds = 24 * 60 * 60 * 1000;

    function calculateNights(checkIn: Date, checkOut: Date): number {
        // Убедимся, что даты валидные
        if (checkIn >= checkOut) {
            throw new Error('Дата заезда должна быть меньше даты выезда');
        }

        // Округляем даты до полуночи, чтобы избежать учета времени
        const checkInDate = new Date(checkIn);
        checkInDate.setHours(0, 0, 0, 0);

        const checkOutDate = new Date(checkOut);
        checkOutDate.setHours(0, 0, 0, 0);

        // Разница в миллисекундах между датами
        const timeDifference = checkOutDate.getTime() - checkInDate.getTime();

        // Переводим миллисекунды в дни (1000 мс * 60 секунд * 60 минут * 24 часа)
        const nights = timeDifference / (1000 * 60 * 60 * 24);

        return nights;
    }

    // Helper function to check if a specific date is within a price period
    function isDateInPeriod(date: Date, period: IListingPricePeriod): boolean {
        const day = date.getDate();
        const month = date.getMonth() + 1; // JS months are 0-based

        const startDate = new Date(2000, period.startMonth - 1, period.startDay); // Year is arbitrary
        const endDate = new Date(2000, period.endMonth - 1, period.endDay);

        // If the period spans across the year boundary (e.g., Dec to Jan)
        if (endDate < startDate) {
            return (
                (month > period.startMonth || (month === period.startMonth && day >= period.startDay)) ||
                (month < period.endMonth || (month === period.endMonth && day <= period.endDay))
            );
        }

        // Regular case (within the same year)
        return (
            (month > period.startMonth || (month === period.startMonth && day >= period.startDay)) &&
            (month < period.endMonth || (month === period.endMonth && day <= period.endDay))
        );
    }

    // Helper function to find the price for a specific date
    function findPriceForDate(date: Date): number | null {
        for (const period of pricePeriods) {
            if (isDateInPeriod(date, period)) {
                return period.price;
            }
        }
        return null;
    }

    let totalPrice = 0;
    let currentDate = new Date(checkIn.getTime());

    while (currentDate < checkOut) {
        const price = findPriceForDate(currentDate) ?? minPrice;
        totalPrice += price;

        // Move to the next day
        currentDate = new Date(currentDate.getTime() + dayInMilliseconds);
    }

    return {
        totalPrice,
        daysCount: calculateNights(checkIn, checkOut),
        dailyPrice: Math.trunc(totalPrice / calculateNights(checkIn, checkOut))
    };
}

export function countDays(startDate: Date, endDate: Date): number {
    const oneDay = 24 * 60 * 60 * 1000; // Количество миллисекунд в одном дне
    const differenceInTime = endDate.getTime() - startDate.getTime();
    return Math.round(differenceInTime / oneDay);
}