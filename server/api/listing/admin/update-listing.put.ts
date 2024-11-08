import {prisma} from "~/server/service/prisma.service";
import listingsService from "~/server/service/listings.service";
import {ListingCreateDTO} from "~/modules/Admin/ListingCRUD/types/dto.types";

export default defineEventHandler(async event => {
	const {listing, id} = await readBody<{listing: ListingCreateDTO, id: number}>(event, {strict: true});

	const updatedListing = await listingsService.updateListing(listing,  id, listing.rooms.length > 0, event.context.user.role);
	//@ts-ignore
	const updatedRooms = await listingsService.updateRooms(listing.rooms, id)

	return updatedListing
})