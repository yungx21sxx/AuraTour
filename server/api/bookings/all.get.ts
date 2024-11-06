import { prisma } from '~/server/service/prisma.service'

export default defineEventHandler(async (event) => {
    try {
        // Получение параметров запроса
        const {
            page = '1',
            pageSize = '10',
            cityId,
            managerId,
            status,
            sortBy = 'createdAt', //
        } = getQuery(event);

        const pageNumber = parseInt(page as string, 10);
        const pageSizeNumber = parseInt(pageSize as string, 10);
        const skip = (pageNumber - 1) * pageSizeNumber;
        const take = pageSizeNumber;

        // Формирование условий фильтрации
        const filters: any = {};

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

        // Определение поля для сортировки
        const validSortFields = ['createdAt', 'checkIn'];
        const sortField = validSortFields.includes(sortBy as string) ? (sortBy as string) : 'createdAt';

        // Получение общего количества записей
        const totalCount = await prisma.booking.count({
            where: filters,
        });

        // Получение списка бронирований с учётом пагинации, фильтров и сортировки
        const bookings = await prisma.booking.findMany({
            where: filters,
            skip,
            take,
            orderBy: {
                [sortField]: 'desc', // Сортировка по выбранному полю в порядке убывания
            },
            include: {
                listing: {
                    include: {
                        city: true,
                        photos: {
                            select: {
                                urlMin: true
                            }
                        }
                    },
                },
                user: {
                    select: {
                        id: true,
                        name: true,
                        surname: true,
                        email: true,
                        bonusPoints: true,
                    }
                },
                managedBy: {
                    select: {
                        name: true,
                        surname: true,
                        id: true,
                    }
                },
            },
        });

        const parsedBookings = bookings.map(booking => {
            const {listing, ...bookingData} = booking
            return {
                ...bookingData,
                listing: {
                    id: listing.id,
                    photo: listing.photos[0].urlMin,
                    city: listing.city.name,
                    address: listing.address,
                    title: listing.title,
                }
            }
        })

        return {
            totalCount,
            page: pageNumber,
            pageSize: take,
            bookings: parsedBookings,
        };
    } catch (error) {
        console.error(error);
        return {
            error: 'Ошибка сервера',
        };
    }
});