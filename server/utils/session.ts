import type { H3Event } from "h3";
import userService from "~/server/service/user.service";

export async function getUserFromSession(event: H3Event) {
    const config = useRuntimeConfig();

    const cookie = getCookie(event, config.cookieName);
    if (!cookie) return null;

    const unsignedSession = unsign(cookie, config.cookieSecret);
    if (!unsignedSession) return null;

    const session = deserialize(unsignedSession);

    if (session.role === 'ADMIN') return session;

    const userFromDB = await userService.getUserById(session.userId);

    return {
        ...userFromDB,
        role: 'USER'
    }
}
