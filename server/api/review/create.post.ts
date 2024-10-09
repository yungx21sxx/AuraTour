import {prisma} from "~/server/service/prisma.service";

export default defineEventHandler(async (event) => {
	const { listingId, comment, rating, userId, userName: userNameFromRequest, userFrom } = await readBody(event)

	// Проверка входных данных
	if (rating < 1 || rating > 5) {
		return createError({ statusCode: 400, statusMessage: 'Рейтинг должен быть между 1 и 5.' })
	}

	try {
		// Проверка существования объекта размещения
		const listingExists = await prisma.listing.findUnique({
			where: {
				id: listingId,
			},
		})
		if (!listingExists) {
			return createError({ statusCode: 404, statusMessage: 'Объект размещения не найден.' })
		}

		let userName = userNameFromRequest;

		// Если userId предоставлен, пытаемся найти пользователя и использовать его имя
		if (userId) {
			const user = await prisma.user.findUnique({
				where: {
					id: userId,
				},
				select: {
					name: true, // Предполагаем, что в модели User есть поле name
				},
			})

			if (!user) {
				return createError({ statusCode: 404, statusMessage: 'Пользователь не найден.' })
			}

			userName = user.name; // Используем имя пользователя из базы данных
		}

		// Создание отзыва
		const review = await prisma.review.create({
			data: {
				listingId,
				comment,
				rating,
				userId: userId || undefined, // Привязываем отзыв к пользователю, если userId предоставлен
				userName,
				userFrom,
			},
		})

		// Возвращение созданного отзыва
		return { data: review }
	} catch (error) {
		// Обработка ошибок при создании отзыва
		return createError({ statusCode: 500, statusMessage: 'Ошибка при создании отзыва' })
	}
})