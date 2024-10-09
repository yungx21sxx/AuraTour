import {prisma} from "~/server/service/prisma.service";
import listingsService from "~/server/service/listings.service";

export default defineEventHandler(async event => {
	return listingsService.getListingsTypes()
})