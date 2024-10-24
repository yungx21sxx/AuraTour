export default defineEventHandler(async (event) => {
    const user = event.context.user;

    if (!user) {
        throw createError({ statusCode: 401, message: 'Пользователь не авторизован' });
    }

    // Возвращаем информацию о пользователе
    return {
        id: user.id,
        name: user.name,
        surname: user.surname,
        avatar: user.avatar ? user.avatar.urlMin : null,
        email: user.email,
        phone: user.phone,
        role: user.role,
        bonusPoints: user.bonusPoints,
    };
});