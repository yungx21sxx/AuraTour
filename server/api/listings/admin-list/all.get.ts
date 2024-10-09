import {prisma} from "~/server/service/prisma.service";

export default defineEventHandler(async event => {
	return prisma.listing.findMany()
})