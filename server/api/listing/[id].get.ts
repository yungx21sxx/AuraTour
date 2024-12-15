import {prisma} from "~/server/service/prisma.service";
import type {Photo, Room} from "@prisma/client";

export default defineEventHandler(async (event) => {
	const id = getRouterParam(event, 'id');
	const listing = await prisma.listing.findUnique({
		where: {
			id: parseInt(<string>id)
		},
		include: {
			flatProperties: true,
			city: {
				select: {
					name: true,
					slug: true,
				}
			},
			reviews: {
				include: {
					user: {
						select: {
							name: true
						}
					}
				}
			},
			type: {
				select: {
					name: true,
					value: true
				}
			},
			manager: {
				select: {
					name: true,
					surname: true,
					phone: true,
					email: true,
					telegram: true,
					avatar: true,
				}
			},
			owner: {
				select: {
					id: true,
					name: true,
					phone: true,
					avatar: true
				}
			},
			photos: {
				select: {
					id: true,
					urlMin: true,
					urlFull: true,
					position: true
				}
			},
			coords: {
				select: {
					longitude: true,
					width: true
				}
			},
			pricePeriods: true,
			rooms: {
				include: {
					pricePeriods: true,
					amenities: {
						select: {
							name: true
						}
					},
					photos: {
						select: {
							id: true,
							position: true,
							urlMin: true,
							urlFull: true
						}
					}
				},
			},
			amenities: {
				include: {
					amenity: {
						select: {
							name: true
						}
					}
				}
			},
			food: {
				include: {
					food: {
						select: {
							name: true
						}
					}
				}
			},
		}
	});
	//@ts-ignore
	const {amenities, food, rooms, photos, reviews, ...listingData} = listing;
	return {
		...listingData,
		food: food.map(i => i.food.name),
		calculatedPrices: null,
		//@ts-ignore
		photos: photos.sort((a, b) => (a.position - b.position))
						.map((photo, index) => ({
							id: index,
							urlMin: photo.urlMin,
							urlFull: photo.urlFull,
							position: photo.position
						})),
		amenities: amenities.map(i => i.amenity.name),
		averageRating: reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length,
		reviewCount: reviews.length,
		isHotelType: rooms.length > 0,
		rooms: rooms.map((room: Room) => {
			//@ts-ignore
			const {amenities, photos, ...roomData} = room
			return {
				photos: photos.sort((a, b) => (a.position - b.position))
					.map((photo, index) => ({
						id: index,
						urlMin: photo.urlMin,
						urlFull: photo.urlFull,
						position: photo.position
					})),
				calculatedPrices: null,
				//@ts-ignore
				amenities: amenities.map(i => i.name),
				...roomData
			}
		})
	}


})