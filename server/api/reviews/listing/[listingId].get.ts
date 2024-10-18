import {H3Event} from "h3";
import {prisma} from "~/server/service/prisma.service";

export default defineEventHandler(async (event: H3Event) => {
    const id = Number(event.context.params.listingId);
    return prisma.review.findMany({
        where: {
            listingId: id
        }
    })
})