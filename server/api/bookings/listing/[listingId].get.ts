import {H3Event} from "h3";
import {prisma} from "~/server/service/prisma.service";

export default defineEventHandler(async (event: H3Event) => {
    const listingId = Number(event.context.params.listingId);
    const user = event.context.user;
    const listing = await prisma.listing.findUnique({
        where: {id: listingId},
    })
    if (!listing) {
        throw createError({ statusCode: 404, statusMessage: 'Объект не найден' });
    }
    if (user.role === 'LANDLORD' && user.id !== listing.managerId) {
        throw createError({ statusCode: 403, message: 'Forbidden: Access is denied' });
    }
    const bookings = await prisma.booking.findMany({
        where: {listingId},
    })
    return {
        bookings,
    }
})