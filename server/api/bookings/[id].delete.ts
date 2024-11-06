import {prisma} from "~/server/service/prisma.service";

export default defineEventHandler(async event => {
    const bookingId = parseInt(event.context.params.id);
    const deletedBooking = await prisma.booking.delete({
        where: {
            id: bookingId
        }
    })
    return deletedBooking
})