import {prisma} from "~/server/service/prisma.service";

export default defineEventHandler(async event => {
	const listingId = getRouterParam(event, 'listingId');
	return prisma.booking.findMany({
		where: {
			listingId: parseInt(<string>listingId)
		},
		include: {
			room: {
				select: {
					name: true
				}
			},
			listing: {
				select: {
					title: true
				}
			},
		}
	})
})
