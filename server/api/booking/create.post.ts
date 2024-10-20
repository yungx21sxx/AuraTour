import type {BookingCreateDTO} from "~/types/dto.types";
import {prisma} from "~/server/service/prisma.service";

export default defineEventHandler(async (event) => {
	try {
		const body = await readBody<BookingCreateDTO>(event)
		// Здесь можно добавить дополнительную валидацию данных из body, если необходимо

		try {
			const booking = await prisma.booking.create({
				data: {
					startDate: body.startDate,
					endDate: body.endDate,
					adults: body.adults,
					childrens: body.childrens,
					surname: body.surname,
					name: body.name,
					comment: body.comment,
					phone: body.phone,
					transfer: body.transfer,
					transferComment: body.transferComment,
					listingId: body.listingId,
					roomId: body.roomId || null,
					userId: body.userId,
				},
			})


			return booking
		} catch (e) {
			console.log(e)
		}

	} catch (error) {
		// Обработка ошибок, например, отправка JSON-ответа с кодом ошибки
		return createError({
			statusCode: 401,
			message: "'Ошибка при создании бронирования'",
		});
	}
})