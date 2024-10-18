import { parseCookies } from 'h3';

import { H3Event } from 'h3';
import { parseURL } from 'ufo';
import {getUserFromToken} from "~/server/utils/auth.utils";

interface RolePermissions {
    [endpoint: string]: string[]; // Массив ролей, которые имеют доступ к эндпоинту
}

// Пути, требующие проверки роли
const roleProtectedPaths: RolePermissions = {
    '/api/users/*': ['ADMIN', 'MANAGER', 'TOURIST', 'LANDLORD'],
    '/api/auth/profile': ['ADMIN', 'MANAGER', 'TOURIST', 'LANDLORD'],
    '/api/booking/listing/*': ['ADMIN', 'MANAGER', 'LANDLORD'],
    '/api/booking/all': ['ADMIN', 'MANAGER'],
    '/api/bonus/*': ['ADMIN', 'MANAGER'],
};

// Пути, где нужно просто добавить пользователя в запрос, без проверки роли
const userExtractPaths: string[] = [
    '/api/reviews/*',
];

// Функция для проверки соответствия пути с шаблоном
const matchPath = (patterns: string[], url: string): string | undefined => {
    return patterns.find((pattern) => {
        const regex = new RegExp('^' + pattern.replace('*', '.*') + '$');
        return regex.test(url);
    });
};


export default defineEventHandler(async (event: H3Event) => {
    const reqUrl = event.node.req.url || '';

    // Используем parseURL из ufo для получения pathname без query-параметров
    const { pathname } = parseURL(reqUrl);

    // Теперь используем pathname для сопоставления путей
    const matchingProtectedPath = matchPath(Object.keys(roleProtectedPaths), pathname);
    const matchingUserExtractPath = matchPath(userExtractPaths, pathname);

    // Если путь не требует обработки, пропускаем middleware
    if (!matchingProtectedPath && !matchingUserExtractPath) {
        return;
    }

    // Извлекаем токен из cookies
    const cookies = parseCookies(event);
    const token = cookies['auth_token'];

    let user = null;

    if (token) {
        user = await getUserFromToken(token).catch((error) => {
            // Логирование ошибки
            console.error('Authentication error:', error);
            if (matchingProtectedPath) {
                // Если путь защищен, выбрасываем ошибку
                throw error;
            }
        });
    } else if (matchingProtectedPath) {
        // Если токена нет, а путь защищен
        throw createError({ statusCode: 401, message: 'Unauthorized: Token not provided' });
    }

    if (matchingProtectedPath) {
        // Если пользователь не найден после проверки токена
        if (!user) {
            throw createError({ statusCode: 401, message: 'Unauthorized: User not found' });
        }

        // Проверяем роль пользователя
        const allowedRoles = roleProtectedPaths[matchingProtectedPath];
        if (!allowedRoles.includes(user.role)) {
            throw createError({ statusCode: 403, message: 'Forbidden: Access is denied' });
        }

        // Добавляем пользователя в контекст
        event.context.user = user;
    } else if (matchingUserExtractPath) {
        // Если токен есть и пользователь найден, добавляем его в контекст
        if (user) {
            event.context.user = user;
        }

        return;
    }
});
