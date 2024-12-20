import type {GetAvailableListingsDTO} from "~/modules/Search/types/dto.types";
import listingsService from "~/server/service/listings.service";

export default defineEventHandler(async event => {
	const {filters, booking, sortBy, managerId} = await readBody<GetAvailableListingsDTO>(event);
	const {page: pageQuery} = getQuery(event)
	const page = pageQuery ? parseInt(<string>pageQuery) : 1;
	return listingsService.searchFilteredListings(booking, filters, sortBy, 'list', page, managerId);
})