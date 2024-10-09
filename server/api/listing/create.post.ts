import type {ListingCreateCompleteDTO} from "~/types/dto.types";
import {prisma} from "~/server/service/prisma.service";

export default defineEventHandler(async event => {
	const {listing, rooms} = await readBody<ListingCreateCompleteDTO>(event, {strict: true});
	const query = {
		title: listing.title,
		description: listing.description,
		city: {
			// @ts-ignore
			connect: {id: listing.cityId}
		},
		type: {
			connect: {
				// @ts-ignore
				id : listing.typeId
			}
		},
		coords: {
			create: {
				// @ts-ignore
				width: listing.coords.width,
				// @ts-ignore
				longitude: listing.coords.longitude
			}
		},

		address: listing.address,
		seaDistance: listing.seaDistance,
		phone: listing.phone,
		phoneRaw: listing.phoneRaw,
		renterName: listing.renterName,
		photos: {
			connect: listing.photos.map(photo => ({id : photo.photoId}))
		},
		minPrice: listing.minPrice
	}

	let photosWithPosition = []

	for (let i = 0; i < listing.photos.length; i++) {
		const currentPhoto = {
			...listing.photos[i],
			position: i
		}
		photosWithPosition.push(currentPhoto)
	}

	if (rooms.length > 0) {
		//@ts-ignore
		query.places = rooms.reduce((prev, cur) => {
			if (prev.places > cur.places) {
				return prev
			}
			return cur
		}).places;
		// @ts-ignore
		query.rooms = {
			create: rooms.map(room => {
				const {amenities, pricePeriods, photos, ...roomData} = room
				if (photos.length > 0) {
					return {
						photos: {
							connect: room.photos.map(photo => ({id : photo.photoId}))
						},
						...roomData,

						pricePeriods: {
							create: pricePeriods
						},
						amenities: {
							create: amenities.map(i => ({name: i}))
						}
					}
				}
				return {
					...roomData,
					pricePeriods: {
						create: pricePeriods
					},
					amenities: {
						create: amenities.map(i => ({name: i}))
					}
				}
			})
		}
	} else {
		// @ts-ignore
		query.area = listing.area;
		// @ts-ignore
		query.pricePeriods = {
			create: listing.pricePeriods
		}
		// @ts-ignore
		query.badCount = listing.badCount;
		// @ts-ignore
		query.minPrice = listing.minPrice;
		// @ts-ignore
		query.places = listing.places;
	}

	if (listing.floor && listing.maxFloor) {
		//@ts-ignore
		query.floor = listing.floor
		//@ts-ignore
		query.maxFloor = listing.maxFloor
	}

	try {
		const createdListing = await prisma.listing.create({
			// @ts-ignore
			data: query
		})

		for (const listingPhoto of photosWithPosition) {
			await prisma.photo.update({
				where: {id: listingPhoto.photoId},
				data: {
					position: listingPhoto.position
				}
			})
		}


		await Promise.all(listing.amenities.map(amenityId => {
			return prisma.listingAmenity.create({
				data: {
					listingId: createdListing.id,
					amenityId
				}
			})
		}))

		await Promise.all(listing.foodOptions.map(foodId => {
			return prisma.listingFood.create({
				data: {
					listingId: createdListing.id,
					foodId
				}
			})
		}))

		return createdListing

	} catch (e) {
		console.log(e)
	}
})