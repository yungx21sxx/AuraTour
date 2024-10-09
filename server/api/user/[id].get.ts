import userService from "~/server/service/user.service";


export default defineEventHandler(async (event) => {
	//@ts-ignore
	const userId: number = parseInt(<string>event.context.params.id);
	const userFromDB = await userService.getUserById(userId);

	if (!userFromDB) {
		return createError({
			statusCode: 401,
			message: 'Пользователь не найден!'
		})
	}

	return userFromDB
})