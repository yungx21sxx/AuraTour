
import {H3Error} from "h3";
import type {User} from "@prisma/client";
import userService from "~/server/service/user.service";

export default defineEventHandler(async (event): Promise<User[] | H3Error> => {
	try {
		const users: User[] = await userService.getUsers()
		return users;
	} catch (e) {
		return createError({
			statusCode: 404,
			message: 'Ошибка получения польователей!'
		})
	}
})