import { defineEventHandler, setCookie } from 'h3';
import { prisma } from "~/server/service/prisma.service";

import jwt from 'jsonwebtoken';

export default defineEventHandler(async (event) => {
    const query = getQuery(event);
    const code = query.code as string;

    if (!code) {
        throw createError({ statusCode: 400, message: 'Code not provided' });
    }

    try {
        // Обмениваем код на access_token
        const tokenResponse = await $fetch('https://oauth.vk.com/access_token', {
            query: {
                client_id: '52476950',
                client_secret: 'hjzUwhe10KrdFeQySaoe',
                redirect_uri: 'https://aura-tour-abkhazia.ru/api/auth/vk/callback',
                code,
            },
        });

        const { access_token, user_id, email } = tokenResponse.data;

        if (!access_token || !user_id) {
            return  createError({ statusCode: 400, message: 'Failed to get access token' });
        }

        // Получаем информацию о пользователе
        const userInfoResponse = await $fetch('https://api.vk.com/method/users.get', {
            query: {
                uids: user_id,
                access_token,
                v: '5.52',
            },
        });

        const vkUser = userInfoResponse.response[0];

        // Ищем пользователя в базе данных
        let user = await prisma.user.findUnique({
            where: { vk_id: user_id.toString() },
        });

        if (!user) {
            // Если пользователя нет, создаем нового
            user = await prisma.user.create({
                data: {
                    vk_id: user_id.toString(),
                    vk_token: access_token,
                    email: email || null,
                    name: vkUser.first_name,
                    surname: vkUser.last_name,
                    isTemporary: false,
                    role: 'TOURIST', // Устанавливаем роль по умолчанию
                },
            });
        } else {
            // Обновляем токен VK
            await prisma.user.update({
                where: { id: user.id },
                data: {
                    vk_token: access_token,
                },
            });
        }

        // Генерируем JWT токен
        const token = jwt.sign({ userId: user.id }, 'gjc8aKwxK3dWgg00XiGqgaWXCuixVb7v', {
            expiresIn: '30d',
        });

        // Устанавливаем cookie с токеном
        setCookie(event, 'auth_token', token, {
            httpOnly: true,
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24 * 30,
        });

        // Перенаправляем пользователя на главную страницу или на нужный маршрут
        return sendRedirect(event, '/');
    } catch (error) {
        console.error('VK Auth Error:', error);
        throw createError({ statusCode: 500, message: 'VK authorization failed' });
    }
});