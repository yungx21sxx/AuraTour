import type {FetchSimilarListingsDTO} from "~/types/dto.types";
import ListingsService from "~/server/service/listings.service";

export default defineEventHandler(async event => {
	const {typeId, listingId} = await readBody<FetchSimilarListingsDTO>(event, {
		strict: true
	});
	return ListingsService.getSimilarListings(typeId, listingId)
})