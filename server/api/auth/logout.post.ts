import { setCookie } from 'h3';

export default defineEventHandler(async (event) => {
    // Очищаем cookie с токеном
    setCookie(event, 'auth_token', '', {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        maxAge: -1, // Удаляем cookie
    });

    return { message: 'Вы успешно вышли из системы' };
});
