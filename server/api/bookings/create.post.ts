import { prisma } from "~/server/service/prisma.service"
import {z} from "zod";
import {bookingSchema} from "~/server/schemas/bookings.schemas";
import {Prisma} from "@prisma/client";
import {upsertListingStatistic} from "~/server/service/statistics.service";
import {v1} from "uuid"

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event);
        const {
            userName,
            userSurname,
            userPhone,
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
            userId = null,
            daysCount,
            bonusApplied,
            bonusAppliedCount = 0,
            status = 'PENDING',
            totalPriceWithBonus = totalPrice,
            prepayWithBonus = prepay,
        } = bookingSchema.parse(body);

        // Проверяем, что указан либо email, либо телефон
        if (!userPhone) {
            return createError({
                statusCode: 400,
                message: 'Необходимо указать телефон',
            });
        }

            // Получение менеджера объекта
        const listing = await prisma.listing.findUnique({
            where: { id: listingId },
        });

        if (!listing) {
            return createError({ statusCode: 404, message: 'Объект не найден' });
        }

        if (userId) {
            const user = await prisma.user.findUnique({
                where: {
                    id: userId
                }
            })
            if (!user) {
                return createError({ statusCode: 404, message: 'Пользователь не найден' });
            }
        }
        const managerId = listing.managerId;

        // Создание бронирования
        const bookingUUID = v1();
        console.log()
        const isAdminCreated = ['ADMIN', 'MANAGER'].includes(event.context.user.role);

        const newBooking = await prisma.booking.create({
            data: {
                checkIn: new Date(checkIn),
                checkOut: new Date(checkOut),
                userName,
                userSurname,
                userPhone,
                adults,
                childrens,
                comment,
                transfer,
                transferComment,
                totalPrice,
                prepay,
                listingId,
                roomId,
                userId: userId || null,
                managerId: managerId || null,
                uuid: bookingUUID,
                daysCount,
                bonusApplied,
                bonusAppliedCount,
                isAdminCreated,
                status,
                prepayWithBonus,
                totalPriceWithBonus,
            },
        });

        if (userId && status === 'CONFIRMED' && bonusApplied) {
            await prisma.bonusTransaction.create({
                data: {
                    userId,
                    bookingId: newBooking.id,
                    amount: bonusAppliedCount,
                    description: `Списание бонусов за бронирование №${newBooking.id}.`,
                },
            });
            await prisma.user.update({
                where: { id: userId },
                data: {
                    bonusPoints: {
                        decrement: bonusAppliedCount,
                    },
                },
            });
        }

        await upsertListingStatistic(listingId, 'submits', 1)

        return {
            success: true,
            uuid: bookingUUID
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
