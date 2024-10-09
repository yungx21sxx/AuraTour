import {prisma} from "~/server/service/prisma.service";

export default defineEventHandler(async event => {
	const listingId = getRouterParam(event, 'listingId');

	return prisma.review.findMany({
		where: {
			listingId: parseInt(<string>listingId)
		},
		include: {
			user: {
				select: {
					name: true,
				}
			}
		}
	})
})