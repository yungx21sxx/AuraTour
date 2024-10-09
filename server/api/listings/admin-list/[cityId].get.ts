import listingsService from "~/server/service/listings.service";
import type {BookingInfoDTO} from "~/types/dto.types";
import type {IListingPreviewResponse} from "~/types/response.types";
import {prisma} from "~/server/service/prisma.service";

export default defineEventHandler(async event => {
	return prisma.listing.findMany({})
})