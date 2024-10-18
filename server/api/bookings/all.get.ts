import { prisma } from '~/server/service/prisma.service'

export default defineEventHandler(async (event) => {
    try {
        // Получение параметров запроса
        const {
            page = '1',
            pageSize = '10',
            checkInStart,
            checkInEnd,
            checkOutStart,
            checkOutEnd,
            cityId,
            managerId,
            status,
        } = getQuery(event);

        const pageNumber = parseInt(page as string, 10);
        const pageSizeNumber = parseInt(pageSize as string, 10);
        const skip = (pageNumber - 1) * pageSizeNumber;
        const take = pageSizeNumber;

        // Формирование условий фильтрации
        const filters: any = {};

        if (checkInStart || checkInEnd) {
            filters.checkIn = {};
            if (checkInStart) {
                filters.checkIn.gte = new Date(checkInStart as string);
            }
            if (checkInEnd) {
                filters.checkIn.lte = new Date(checkInEnd as string);
            }
        }

        if (checkOutStart || checkOutEnd) {
            filters.checkOut = {};
            if (checkOutStart) {
                filters.checkOut.gte = new Date(checkOutStart as string);
            }
            if (checkOutEnd) {
                filters.checkOut.lte = new Date(checkOutEnd as string);
            }
        }

        if (managerId) {
            filters.managerId = parseInt(managerId as string, 10);
        }

        if (status) {
            filters.status = status;
        }

        if (cityId) {
            filters.listing = {
                cityId: parseInt(cityId as string, 10),
            };
        }

        // Получение общего количества записей
        const totalCount = await prisma.booking.count({
            where: filters,
        });

        // Получение списка бронирований с учётом пагинации и фильтров
        const bookings = await prisma.booking.findMany({
            where: filters,
            skip,
            take,
            include: {
                listing: {
                    include: {
                        city: true,
                    },
                },
                user: true,
                managedBy: true,
            },
        });

        // Возврат данных клиенту
        return {
            totalCount,
            page: pageNumber,
            pageSize: take,
            bookings,
        };
    } catch (error) {
        console.error(error);
        return {
            error: 'Ошибка сервера',
        };
    }
});