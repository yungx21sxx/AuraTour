import {prisma} from "~/server/service/prisma.service";

export default defineEventHandler(async (event) => {
	const id = getRouterParam(event, 'id');
	const {note} = await readBody<{note: string}>(event)
	return prisma.listing.update({
		where: {
			id: parseInt(<string>id)
		},
		data: {
			note,
		},
		select: {
			note: true
		}
	})
})