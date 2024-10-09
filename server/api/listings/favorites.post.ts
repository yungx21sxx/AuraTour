import ListingsService from "~/server/service/listings.service";

export default defineEventHandler(async event => {
	const {listingIDs} = await readBody<{listingIDs: number[]}>(event, {strict: true})
	return ListingsService.getFavorites(listingIDs)
})