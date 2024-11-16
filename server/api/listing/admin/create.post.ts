
import {prisma} from "~/server/service/prisma.service";
import {ListingCreateDTO} from "~/modules/Admin/ListingCRUD/types/dto.types";
import {FlatProperties} from "@prisma/client";

export default defineEventHandler(async event => {
	const listing = await readBody<ListingCreateDTO>(event, {strict: true})

	const user = event.context.user;

	if (user.role === 'TOURIST') {
		await prisma.user.update({
			where: {
				id: user.id
			},
			data: {
				role: 'LANDLORD'
			}
		})
	}
	const createByUser = ['TOURIST', 'LANDLORD'].includes(user.role);

	const query: Record<string, any> = {
		title: listing.title,
		description: listing.description,
		city: {
			connect: {id: listing.cityId}
		},
		type: {
			connect: {
				id : listing.typeId
			}
		},
		owner: {
			connect: {
				id: createByUser ? user.id : listing.ownerId
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
		validated: !createByUser,
		address: listing.address,
		seaDistance: listing.seaDistance,
		photos: {
			connect: listing.photos.map(photo => ({id : photo.photoId}))
		},
		minPrice: listing.minPrice
	}

	if (!createByUser) {
		query.manager = {
			connect: {
				id: listing.managerId,
			}
		}
	}
	let photosWithPosition = []

	for (let i = 0; i < listing.photos.length; i++) {
		const currentPhoto = {
			...listing.photos[i],
			position: i
		}
		photosWithPosition.push(currentPhoto)
	}

	if (listing.rooms.length > 0) {
		//@ts-ignore
		query.places = listing.rooms.reduce((prev, cur) => {
			if (prev.places > cur.places) {
				return prev
			}
			return cur
		}).places;
		// @ts-ignore
		query.rooms = {
			create: listing.rooms.map(room => {
				const {amenities, pricePeriods, photos, id, ...roomData} = room

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

	if (listing.typeId === 1) {
		//@ts-ignore
		query.flatProperties = {
			create: {
				...listing.flatProperties
			}
		}
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
		throw e
	}
})