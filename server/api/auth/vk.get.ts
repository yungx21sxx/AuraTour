import { defineEventHandler, sendRedirect } from 'h3';

export default defineEventHandler(async (event) => {
    const params = new URLSearchParams({
        client_id: process.env.VK_CLIENT_ID || '',
        redirect_uri: process.env.VK_REDIRECT_URI || '',
        display: 'page',
        scope: 'email',
        response_type: 'code',
        v: '5.131',
    });

    const vkAuthUrl = `https://oauth.vk.com/authorize?${params.toString()}`;

    // Перенаправляем пользователя на VK
    return sendRedirect(event, vkAuthUrl);
});