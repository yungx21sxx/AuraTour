import { prisma } from "~/server/service/prisma.service";

export default defineEventHandler(async (event) => {
    const query = getQuery(event);
    const citySlug = query.citySlug as string | null;
    const typeSlug = query.typeSlug as string | null;

    if (!citySlug && !typeSlug) {
        return { seoPage: null };
    }

    try {
        // Инициализация переменных для ID
        let cityId: number | null = null;
        let listingTypeId: number | null = null;

        // Поиск города по slug, если передан
        if (citySlug) {
            const city = await prisma.city.findUnique({
                where: { slug: citySlug },
                select: { id: true },
            });
            if (!city) return { seoPage: null }; // Город не найден
            cityId = city.id;
        }

        // Поиск типа листинга по slug (value), если передан
        if (typeSlug) {
            const listingType = await prisma.listingType.findFirst({
                where: {
                    value: typeSlug, // Ищем по полю value
                },
                select: {
                    id: true,
                },
            });
            if (!listingType) return { seoPage: null }; // Тип не найден
            listingTypeId = listingType.id;
        }

        // Поиск SEO-страницы с учетом найденных ID
        const seoPage = await prisma.seoPage.findFirst({
            where: {
                cityId: cityId ?? (citySlug ? undefined : null),
                listingTypeId: listingTypeId ?? (typeSlug ? undefined : null),
            },
            include: {
                city: true,
                ListingType: true,
            },
        });

        return { seoPage: seoPage || null };
    } catch (error) {
        console.error("Ошибка при получении seoPage:", error);
        return { seoPage: null };
    }
});