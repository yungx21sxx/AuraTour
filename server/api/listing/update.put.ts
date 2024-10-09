import type {ListingCreateCompleteDTO} from "~/types/dto.types";
import {prisma} from "~/server/service/prisma.service";
import listingsService from "~/server/service/listings.service";

export default defineEventHandler(async event => {
	const {listing, rooms} = await readBody<ListingCreateCompleteDTO>(event, {strict: true});

	const listingEntity = rooms.length > 0 ? rooms.reduce((prev, cur) => {
		if (prev.places > cur.places) {
			return prev
		}
		return cur
	}).places : listing.places

	const createdListing = await listingsService.updateListing(listing, listingEntity);
	//@ts-ignore
	const createdRooms = await listingsService.updateRooms(rooms, listing.id)

	return createdListing
})