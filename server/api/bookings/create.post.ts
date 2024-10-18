import { prisma } from "~/server/service/prisma.service"
import {z} from "zod";
import {bookingSchema} from "~/server/schemas/bookings.schemas";
import {Prisma} from "@prisma/client";
import {upsertListingStatistic} from "~/server/service/statistics.service";

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event);
        const {
            name,
            surname,
            email,
            phone,
            checkIn,
            checkOut,
            adults,
            childrens = 0,
            comment,
            transfer = false,
            transferComment,
            totalPrice,
            prepay,
            listingId,
            roomId = null,
        } = bookingSchema.parse(body);

        // Проверяем, что указан либо email, либо телефон
        if (!email && !phone) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Необходимо указать email или телефон',
            });
        }

        // Транзакция для создания пользователя и бронирования
        const booking = await prisma.$transaction(async (prisma) => {
            // Поиск существующего пользователя по email или телефону
            let user = null;
            const userConditions = [];
            if (email) userConditions.push({ email });
            if (phone) userConditions.push({ phone });

            if (userConditions.length > 0) {
                user = await prisma.user.findFirst({
                    where: { OR: userConditions },
                });
            }

            // Создание временного пользователя, если не найден
            if (!user) {
                user = await prisma.user.create({
                    data: {
                        name,
                        surname,
                        email,
                        phone,
                        isTemporary: true,
                        role: 'TOURIST',
                    },
                });
            }

            // Получение менеджера объекта
            const listing = await prisma.listing.findUnique({
                where: { id: listingId },
            });

            if (!listing) {
                throw createError({ statusCode: 404, statusMessage: 'Объект не найден' });
            }

            const managerId = listing.managerId;

            // Создание бронирования
            const newBooking = await prisma.booking.create({
                data: {
                    status: 'PENDING',
                    checkIn: new Date(checkIn),
                    checkOut: new Date(checkOut),
                    adults,
                    childrens,
                    comment,
                    transfer,
                    transferComment,
                    totalPrice,
                    prepay,
                    listingId,
                    roomId,
                    userId: user.id,
                    managerId: managerId || null,
                },
            });

            await upsertListingStatistic(listingId, 'submits', 1)

            return newBooking;
        });

        return {
            success: true,
            booking,
        };
    } catch (error) {
        console.error(error);

        // Обработка ошибок валидации Zod
        if (error instanceof z.ZodError) {
            const validationErrors = error.errors.map((err) => ({
                field: err.path.join('.'),
                message: err.message,
            }));
            return sendError(
                event,
                createError({
                    statusCode: 400,
                    statusMessage: 'Ошибка валидации',
                    data: validationErrors,
                })
            );
        }

        // Обработка ошибок Prisma
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                const target = error.meta?.target;
                return sendError(
                    event,
                    createError({
                        statusCode: 400,
                        statusMessage: `Уникальное ограничение нарушено для полей: ${target}`,
                    })
                );
            }
        }

        return sendError(
            event,
            createError({
                statusCode: error.statusCode || 500,
                statusMessage: error.statusMessage || 'Внутренняя ошибка сервера',
            })
        );
    }
});
