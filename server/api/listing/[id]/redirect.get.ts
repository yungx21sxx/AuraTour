import {prisma} from "~/server/service/prisma.service";

export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id');
    const listing = await prisma.listing.findUnique({
        where: {
            id: parseInt(<string>id)
        }
    })
    if (!listing) {
        return createError({
            message: 'Объект не найден',
            statusCode: 404
        })
    }
    return {
        href: `/listing/${listing.id}`
    };
});