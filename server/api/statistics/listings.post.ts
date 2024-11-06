import { prisma } from "~/server/service/prisma.service";


interface StatisticsRequestBody {
    page: number;
    itemsPerPage: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    startDate?: string;
    endDate?: string;
}

export default defineEventHandler(async (event) => {
    // Получаем данные из тела запроса
    const body = await readBody<StatisticsRequestBody>(event);
    const {
        page = 1,
        itemsPerPage = 10,
        sortBy = 'id',
        sortOrder = 'asc',
        startDate,
        endDate,
    } = body;


    // Проверка валидности параметров пагинации
    if (page < 1 || itemsPerPage < 1) {
        return sendError(event, createError({ statusCode: 400, statusMessage: 'Invalid pagination parameters' }));
    }

    // Список допустимых полей для сортировки
    const allowedSortFields = ['id', 'views', 'favorites', 'submits', 'bookings', 'revenue'];

    // Проверка валидности поля сортировки
    if (!allowedSortFields.includes(sortBy)) {
        return sendError(event, createError({ statusCode: 400, statusMessage: 'Invalid sort field' }));
    }

    // Проверка валидности порядка сортировки
    if (!['asc', 'desc'].includes(sortOrder)) {
        return sendError(event, createError({ statusCode: 400, statusMessage: 'Invalid sort order' }));
    }

    // Проверка валидности дат
    if ((startDate && isNaN(Date.parse(startDate))) || (endDate && isNaN(Date.parse(endDate)))) {
        return sendError(event, createError({ statusCode: 400, statusMessage: 'Invalid date format' }));
    }

    // Проверка прав доступа (опционально)
    // const user = event.context.auth?.user;
    // if (!user || !['MANAGER', 'SUPER_ADMIN'].includes(user.role)) {
    //   return sendError(event, createError({ statusCode: 403, statusMessage: 'Forbidden' }));
    // }

    try {
        // Формирование условий для фильтрации по дате
        let dateFilter = {};
        if (startDate && endDate) {
            dateFilter = {
                date: {
                    gte: new Date(startDate),
                    lte: new Date(endDate),
                },
            };
        }

        // Получение всех объектов и их статистики
        const listings = await prisma.listing.findMany({
            select: {
                id: true,
                title: true,
                // Добавьте другие поля при необходимости
                statistics: {
                    where: dateFilter,
                },
            },
        });

        // Агрегация статистики для каждого объекта
        const listingsWithStats = listings.map((listing) => {
            let totalViews = 0;
            let totalSubmits = 0
            let totalFavorites = 0;
            let totalBookings = 0;
            let totalRevenue = 0;

            listing.statistics.forEach((stat) => {
                totalViews += stat.views;
                totalSubmits += stat.submits;
                totalFavorites += stat.favorites;
                totalBookings += stat.bookings;
                totalRevenue += stat.revenue;
            });

            return {
                id: listing.id,
                title: listing.title,
                // Добавьте другие поля объекта Listing при необходимости
                views: totalViews,
                favorites: totalFavorites,
                submits: totalSubmits,
                bookings: totalBookings,
                revenue: totalRevenue,
            };
        });

        // Сортировка данных по выбранной метрике
        listingsWithStats.sort((a, b) => {
            const fieldA = a[sortBy as keyof typeof a];
            const fieldB = b[sortBy as keyof typeof b];

            if (fieldA < fieldB) return sortOrder === 'asc' ? -1 : 1;
            if (fieldA > fieldB) return sortOrder === 'asc' ? 1 : -1;
            return 0;
        });

        // Пагинация данных
        const totalItems = listingsWithStats.length;
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;

        const paginatedData = listingsWithStats.slice(startIndex, endIndex);

        return {
            data: paginatedData,
            pagination: {
                page,
                itemsPerPage,
                totalItems,
                totalPages,
            },
        };
    } catch (error) {
        return sendError(event, error);
    }
});