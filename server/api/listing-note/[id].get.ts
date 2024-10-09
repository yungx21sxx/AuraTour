import {prisma} from "~/server/service/prisma.service";

export default defineEventHandler(async (event) => {
	const id = getRouterParam(event, 'id');
	return prisma.listing.findUnique({
		where: {
			id: parseInt(<string>id)
		},
		select: {
			note: true
		}
	})
})