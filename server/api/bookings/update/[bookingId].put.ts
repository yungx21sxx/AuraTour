import { PrismaClient, Prisma } from '@prisma/client';
import { z } from 'zod';
import {bookingUpdateSchema} from "~/server/schemas/bookings.schemas";
import {upsertListingStatistic} from "~/server/service/statistics.service";
import {prisma} from "~/server/service/prisma.service";


export default defineEventHandler(async (event) => {
    try {
        const bookingId = parseInt(event.context.params.bookingId, 10);

        if (isNaN(bookingId)) {
            return  createError({ statusCode: 400, statusMessage: 'Некорректный ID бронирования' });
        }

        const body = await readBody(event);


        const {
            userName,
            userPhone,
            userSurname,
            listingId,
            roomId,
            status,
            checkIn,
            checkOut,
            adults,
            childrens,
            comment,
            transfer,
            transferComment,
            totalPrice,
            prepay,
            userId = null,
            bonusApplied,
            bonusAppliedCount,
            prepayWithBonus,
            totalPriceWithBonus,
            daysCount,
        } = bookingUpdateSchema.parse(body);

        console.log(body)

        // Получаем текущее бронирование
        const currentBooking = await prisma.booking.findUnique({
            where: { id: bookingId },
            include: { user: true },
        });

        if (!currentBooking) {
            return  createError({ statusCode: 404, statusMessage: 'Бронирование не найдено' });
        }


        const booking = await prisma.booking.update({
            where: { id: bookingId },
            data: {
                userName,
                userPhone,
                userSurname,
                listingId,
                roomId,
                status,
                checkIn: checkIn ? new Date(checkIn) : undefined,
                checkOut: checkOut ? new Date(checkOut) : undefined,
                adults,
                childrens,
                comment,
                transfer,
                transferComment,
                totalPrice,
                prepay,
                bonusApplied,
                bonusAppliedCount,
                prepayWithBonus,
                totalPriceWithBonus,
                daysCount,
                userId
            },
        });

        // if (currentBooking.status === 'PENDING' && status === 'CONFIRMED' && bonusApplied && booking.userId && bonusAppliedCount && userId) {
        //     await prisma.bonusTransaction.create({
        //         data: {
        //             userId: booking.userId,
        //             bookingId: booking.id,
        //             amount: bonusAppliedCount,
        //             description: `Списание бонусов за бронирование №${booking.id}.`,
        //         },
        //     });
        //     await prisma.user.update({
        //         where: { id: userId },
        //         data: {
        //             bonusPoints: {
        //                 decrement: bonusAppliedCount,
        //             },
        //         },
        //     });
        // }

        // Если статус изменился на 'COMPLETED', начисляем бонусы
        if (status === 'COMPLETED' && currentBooking.status !== 'COMPLETED' && booking.userId && !bonusApplied && userId) {
            const bonusAmount = Math.floor((booking.totalPrice || currentBooking.totalPrice) * 0.03);
            const revenue =  Math.floor((booking.totalPrice || currentBooking.totalPrice) * 0.1);
            // Создаем запись о бонусной транзакции
            // await prisma.bonusTransaction.create({
            //     data: {
            //         userId: booking.userId,
            //         bookingId: booking.id,
            //         amount: bonusAmount,
            //         description: `Начисление бонусов за завершенное бронирование №${booking.id}`,
            //     },
            // });
            await upsertListingStatistic(listingId, 'bookings', 1);
            await upsertListingStatistic(listingId, 'revenue', revenue);

            // Обновляем бонусный счет пользователя
            // await prisma.user.update({
            //     where: { id: booking.userId },
            //     data: {
            //         bonusPoints: {
            //             increment: bonusAmount,
            //         },
            //     },
            // });
        }

        return {
            success: true,
            booking: booking,
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
            return sendError(
                event,
                createError({
                    statusCode: 400,
                    statusMessage: `Ошибка базы данных: ${error.message}`,
                })
            );
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