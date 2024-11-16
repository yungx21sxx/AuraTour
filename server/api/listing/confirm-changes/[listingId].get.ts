import {prisma} from "~/server/service/prisma.service";

export default defineEventHandler(async event => {
    const listingId = parseInt(event.context.params.listingId);

    return prisma.listing.update({
        where: {
            id: listingId,
        },
        data: {
            validated: true,
        }
    })
})