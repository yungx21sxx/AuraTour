import {prisma} from "~/server/service/prisma.service";

export default defineEventHandler(async event => {
    const listingId = parseInt(event.context.params.listingId);

    const {managerId} = await readBody(event);

    return prisma.listing.update({
        where: {
            id: listingId,
        },
        data: {
            validated: true,
            manager: {
                connect: {
                    id: managerId
                }
            }
        }
    })
})