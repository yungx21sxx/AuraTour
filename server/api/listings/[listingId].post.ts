import listingsService from "~/server/service/listings.service";
import type {BookingInfoDTO} from "~/types/dto.types";
import type {IListingPreviewResponse} from "~/types/response.types";

export default defineEventHandler(async event => {
	const listingId = getRouterParam(event, 'listingId');
	const bookingInfo = await readBody<BookingInfoDTO>(event, {strict: true});
	try {
		return listingsService.getListing(parseInt(<string>listingId), bookingInfo)
	} catch (e: any) {
		return createError({
			statusCode: 401,
			message: e.message
		})
	}

})