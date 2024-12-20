interface PricePeriod {
    startDay: number;
    startMonth: number;
    endDay: number;
    endMonth: number;
    price: number;
}

function calculateStayPrice(
    pricePeriods: PricePeriod[],
    minPrice: number,
    checkIn: Date,
    checkOut: Date
): number {
    const dayInMilliseconds = 24 * 60 * 60 * 1000;

    // Helper function to check if a specific date is within a price period
    function isDateInPeriod(date: Date, period: PricePeriod): boolean {
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

    return totalPrice;
}

// Пример использования
const pricePeriods: PricePeriod[] = [
    { startDay: 1, startMonth: 1, endDay: 31, endMonth: 1, price: 100 },
    { startDay: 15, startMonth: 7, endDay: 20, endMonth: 7, price: 200 },
    { startDay: 25, startMonth: 12, endDay: 31, endMonth: 12, price: 300 }
];

const minPrice = 50;
const checkIn = new Date(2024, 6, 14); // 14 июля
const checkOut = new Date(2024, 6, 21); // 21 июля

const totalPrice = calculateStayPrice(pricePeriods, minPrice, checkIn, checkOut);
console.log(`Total price: ${totalPrice}`);