import {H3Event} from "h3";
import {prisma} from "~/server/service/prisma.service";

export default defineEventHandler(async (event: H3Event) => {
    const listingId = Number(event.context.params.listingId);
    const user = event.context.user;
    const listing = await prisma.listing.findUnique({
        where: {id: listingId},
    })
    if (!listing) {
        throw createError({ statusCode: 404, message: 'Объект не найден' });
    }
    const bookings = await prisma.booking.findMany({
        where: {listingId},
        orderBy: {
            checkIn: 'desc'
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    surname: true,
                    email: true,
                    bonusPoints: true,
                    phone: true
                }
            },
            room: {
                select: {
                    name: true,
                    id: true
                }
            }
        }
    })
    return {
        bookings,
    }
})