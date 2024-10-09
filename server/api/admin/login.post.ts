import {H3Error, H3Event} from "h3";
import type {AdminLoginDTO} from "~/types/dto.types";
import adminService from "~/server/service/admin.service";
import type {Admin} from ".prisma/client";
import type {UserAuthResponse} from "~/types/response.types";

export default defineEventHandler(async (event: H3Event): Promise<UserAuthResponse | H3Error> => {
	const body = await readBody<AdminLoginDTO>(event);

	const { login, password } = body;
	const admin: Admin | null = await adminService.getAdminByLogin(login);
	if (!admin) {
		return createError({
			statusCode: 401,
			message: "Неверный логин или пароль!",
		});
	}
	const verified = await verify(password, admin.passwordHash);
	if (!verified) {
		return createError({
			statusCode: 401,
			message: "Неверный логин или пароль!",
		});
	}
	const config = useRuntimeConfig();

	const session = serialize({ userId: admin.id, role: 'ADMIN'});

	const signedSession = sign(session, <string>config.cookieSecret);

	setCookie(event, config.cookieName, signedSession, {
		httpOnly: true,
		path: "/",
		sameSite: "strict",
		secure: process.env.NODE_ENV === "production",
		expires: new Date(Date.now() + config.cookieRememberMeExpires)
	});

	//@ts-ignore
	return {
		id: admin.id,
		role: 'ADMIN'
	}
})