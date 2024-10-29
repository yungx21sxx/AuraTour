import {prisma} from "~/server/service/prisma.service";

export default defineEventHandler(async (event) => {
    const query = getQuery(event);
    const citySlug = query.citySlug || null;
    const typeSlug = query.typeSlug || null;

    if (!citySlug && !typeSlug) {
        return { seoPage: null }; // Если оба параметра отсутствуют
    }

    try {
        const seoPage = await prisma.seoPage.findFirst({
            where: {
                city: citySlug ? { slug: citySlug } : undefined,
                ListingType: typeSlug ? { value: typeSlug } : undefined,
            },
            include: {
                city: true,
                ListingType: true,
            },
        });

        return { seoPage: seoPage || null }; // Возвращаем seoPage или null
    } catch (error) {
        console.error('Ошибка при получении seoPage:', error);
        return { seoPage: null };
    }
});