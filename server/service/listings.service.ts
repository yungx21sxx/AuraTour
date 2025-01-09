import type {
	FiltersDTO,
	GetAvailableListingsDTO,
	RoomCreateDTO
} from "~/types/dto.types";

import {type ListingCreateDTO} from "~/modules/Admin/ListingCRUD/types/dto.types";

import {prisma} from "~/server/service/prisma.service";
import type {Listing, PricePeriod, Prisma, Room} from "@prisma/client";
import {BookingInfoDTO} from "~/modules/Booking/types/dto.types";

class ListingsService {
	private toUTCStartOfDay(dateString: Date): Date {
		const date = new Date(dateString);
		return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
	}
	transformResponse(listing: any, transformType: 'catalog' | 'listing') {
		const {food, city, amenities, photos, type, cityId, typeId,  pricePeriods, rooms, coords, ...mainListingData} = listing;
		const catalogResponse = {
			//@ts-ignore
			city: city.name,
			coords,
			//@ts-ignore
			amenities: amenities.map(i => i.amenity.name),
			//@ts-ignore
			photos: transformType === 'catalog' ? photos.sort((a, b) => a.position - b.position).map(i => i.urlMin) : photos,
			typeId,

			isHotelType: listing?._count?.rooms > 0,
			...mainListingData,
		}

		const listingPageResponse = transformType === 'listing' ? {
			//@ts-ignore
			food: food.map(i => i.food.name),
			city: city.name,
			cityId,
			photos,
			typeId,
			regionId: city.regionId,
			region: city.region.name,

			//@ts-ignore
			amenities: amenities.map(i => i.amenity.name),
			//@ts-ignore
			isHotelType: !rooms ? false : rooms.length > 0,
			type: type.value,
			coords: [listing.coords.longitude, listing.coords.width],
			rooms,
			...mainListingData,
		} : {}
		return transformType === 'catalog' ? catalogResponse : listingPageResponse
	}
	private calculateDaysBetweenDates(start: Date, end: Date): number {
		const startOfDayStart = this.toUTCStartOfDay(start);
		const startOfDayEnd = this.toUTCStartOfDay(end);
		//@ts-ignore
		const duration = Math.ceil((startOfDayEnd - startOfDayStart) / (1000 * 60 * 60 * 24));

		// Возвращаем минимум 1 день, даже если даты совпадают
		return Math.max(duration, 1);

	}

	calculatePrices(pricePeriods: PricePeriod[], minPrice: number, checkIn: Date | null, checkOut: Date | null): {dailyPrice: number, totalPrice: number | null} {

		if (!checkOut || !checkIn || pricePeriods.length === 0) {
			return {
				totalPrice: null,
				dailyPrice: minPrice
			}
		}

		checkIn = new Date(checkIn);
		checkOut = new Date(checkOut);

		//@ts-ignore
		const dayInMilliseconds = 24 * 60 * 60 * 1000;

		function calculateNights(checkIn: Date, checkOut: Date): number {
			// Убедимся, что даты валидные
			if (checkIn >= checkOut) {
				return 1;
			}

			// Округляем даты до полуночи, чтобы избежать учета времени
			const checkInDate = new Date(checkIn);
			checkInDate.setHours(0, 0, 0, 0);

			const checkOutDate = new Date(checkOut);
			checkOutDate.setHours(0, 0, 0, 0);

			// Разница в миллисекундах между датами
			const timeDifference = checkOutDate.getTime() - checkInDate.getTime();

			// Переводим миллисекунды в дни (1000 мс * 60 секунд * 60 минут * 24 часа)
			const nights = timeDifference / (1000 * 60 * 60 * 24);

			return nights;
		}

		// Helper function to check if a specific date is within a price period
		function isDateInPeriod(date: Date, period: PricePeriod): boolean {
			const day = date.getDate();
			const month = date.getMonth() + 1; // JS months are 0-based

			const startDate = new Date(2000, period.startMonth - 1, period.startDay); // Year is arbitrary
			const endDate = new Date(2000, period.endMonth - 1, period.endDay);

			// If the period spans across the year boundary (e.g., Dec to Jan)
			if (endDate < startDate) {
				return (
					(month > period.startMonth || (month === period.startMonth && day >= period.startDay)) ||
					(month < period.endMonth || (month === period.endMonth && day <= period.endDay))
				);
			}

			// Regular case (within the same year)
			return (
				(month > period.startMonth || (month === period.startMonth && day >= period.startDay)) &&
				(month < period.endMonth || (month === period.endMonth && day <= period.endDay))
			);
		}

		// Helper function to find the price for a specific date
		function findPriceForDate(date: Date): number | null {
			for (const period of pricePeriods) {
				if (isDateInPeriod(date, period)) {
					return period.price;
				}
			}
			return null;
		}

		let totalPrice = 0;
		let currentDate = new Date(checkIn.getTime());

		while (currentDate < checkOut) {
			const price = findPriceForDate(currentDate) ?? minPrice;
			totalPrice += price;

			// Move to the next day
			currentDate = new Date(currentDate.getTime() + dayInMilliseconds);
		}

		return {
			totalPrice,
			dailyPrice: Math.trunc(totalPrice / calculateNights(checkIn, checkOut))
		};

	}

	async getSimilarListings(typeId: number, listingId: number) {
		const listings = await prisma.listing.findMany({
			where: { typeId, validated: true },
			include: {
				city: true,
				photos: true,
				amenities: {
					include: {
						amenity: true
					}
				},
				_count: true,
			},
			take: 10
		})
		const totalCount = await prisma.listing.count({
			where: { typeId }
		})
		const transformedListings =  listings
			.map(listing => this.transformResponse(listing, 'catalog'))
			.filter(i => i.id !== listingId);
		return {
			listings: transformedListings,
			totalCount,
		}
	}
	async getListingsTypes() {
		let categories = await prisma.listingType.findMany({
			include: {
				listings: {
					orderBy: [
						{
							createdAt: 'desc'
						}
					],
					include: {
						photos: true,
						amenities: {
							include: {
								amenity: true
							}
						},
						food: {
							include: {
								food: true
							}
						},
						type: true,
						city: {
							include: {
								region: true
							}
						},
						coords: true,
						reviews: true,
						rooms: true,
					},
					take: 10
				},
				_count: true
			},

		})

		for (let i = 0; i < categories.length; i++) {
			//@ts-ignore
			categories[i].totalCount = categories[i]._count.listings

			//@ts-ignore
			categories[i].listings = categories[i].listings.map(listing => {
				const reviewCount = listing.reviews.length;
				const averageRating = listing.reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviewCount || 0;
				const dailyPrice = listing.minPrice;
				return {
					...this.transformResponse(listing, 'catalog'),
					averageRating,
					dailyPrice,
					totalPrice: null,
					reviewCount
				}
			})
		}
		return categories;
	}


	async getListing(listingId: number, bookingInfoDTO: BookingInfoDTO) {
		const listing = await prisma.listing.findUnique({
			where: {id: listingId},
			include: {
				pricePeriods: true,
				photos: true,
				amenities: {
					include: {
						amenity: true
					}
				},
				food: {
					include: {
						food: true
					}
				},
				type: true,

				city: {
					include: {
						region: true
					}
				},
				coords: true,
				reviews: true
			},
		})

		if (!listing) {
			throw new Error('Объект не найден') as Error;
		}


		let prices: {dailyPrice: number, totalPrice: number | null};

		let rooms: (Room & {totalPrice: number | null, dailyPrice: number, amenities: string[]})[] = [];
		const roomsData = await prisma.room.findMany({
			where: {
				listingId: listing.id
			},
			include: {
				pricePeriods: true,
				photos: true,
				amenities: true,
			}
		})
		if (roomsData && roomsData.length > 0) {
			let calculatedPriceList: {totalPrice: number | null, dailyPrice: number}[] = []


			roomsData.forEach(room => {
				const {totalPrice, dailyPrice} = this.calculatePrices(room?.pricePeriods, room.minPrice, bookingInfoDTO.checkIn, bookingInfoDTO.checkOut);
				const {pricePeriods, amenities, ...data} = room;
				rooms.push({
					...data,
					amenities: amenities.map(i => i.name),
					totalPrice,
					dailyPrice
				})
				calculatedPriceList.push({
					totalPrice,
					dailyPrice
				})
			})
			prices = calculatedPriceList.toSorted((a, b) => a.dailyPrice - b.dailyPrice)[0]
		} else {
			prices = this.calculatePrices(listing?.pricePeriods, listing.minPrice, bookingInfoDTO.checkIn, bookingInfoDTO.checkOut);
		}
		const reviewCount = listing.reviews.length;
		const averageRating = listing.reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviewCount || 0;
		const {reviews, ...listingData} = listing
		return {
			...this.transformResponse(listingData, 'listing'),
			...prices,
			rooms,
			reviewCount,
			averageRating,
			daysCount: this.calculateDaysBetweenDates(new Date(bookingInfoDTO.checkIn), new Date( bookingInfoDTO.checkOut))
		}
	}


	async searchFilteredListings(bookingInfo: BookingInfoDTO, sortFilters: FiltersDTO, sortBy: GetAvailableListingsDTO['sortBy'] = "popularity", target: 'map' | 'list',  page: number, managerId: number | null) {
		const pageSize: number = 10;


		let queryConditions = bookingInfo.citySlug ? {
			city: {
				slug: bookingInfo.citySlug
			},
			// places: { gte: bookingInfo.peoples },
			AND: []
		} : {
			// places: { gte: bookingInfo.peoples },
			AND: []
		};

		if (sortFilters) {
			if (sortFilters.amenitiesId.length > 0) {
				//@ts-ignore
				queryConditions.AND.push({ amenities: { some: { amenityId: { in: sortFilters.amenitiesId } } } });
			}
			if (sortFilters.foodsId.length > 0) {
				//@ts-ignore
				queryConditions.AND.push({ food: { some: { foodId: { in: sortFilters.foodsId } } } });
			}
			if (sortFilters.housingTypesId.length > 0) {
				//@ts-ignore
				queryConditions.AND.push({ typeId: { in: sortFilters.housingTypesId } });
			}
			if (sortFilters.minRoomCount && !(sortFilters.housingTypesId.includes(2) || sortFilters.housingTypesId.includes(6) ||  sortFilters.housingTypesId.includes(8))) {
				//@ts-ignore
				queryConditions.badCount =  { gte: 0 }
			}
		}

		if (managerId) {
			queryConditions.managerId = managerId
		}
		let listings = await prisma.listing.findMany({
			where: {
				...queryConditions,
				validated: true,
			},
			orderBy: [
				{
					createdAt: sortBy === 'early' ?  'asc' : 'desc'
				}
			],
			include: {
				pricePeriods: true,
				photos: true,
				coords: {
					select: {
						longitude: true,
						width: true
					}
				},
				amenities: {
					include: {
						amenity: true
					}
				},
				food: {
					include: {
						food: true
					}
				},
				city: {
					include: {
						region: true
					}
				},
				_count: {
					select: {
						rooms: true
					}
				},
			},
		});

		const reviews = await prisma.review.findMany({
			where: {
				listingId: {
					in: listings.map(listing => listing.id),
				},
			},
			select: {
				listingId: true,
				rating: true,
			},
		});

		let calculatedListings = [];

		for (const listing of listings) {
			const listingReviews = reviews.filter(review => review.listingId === listing.id);
			const reviewCount = listingReviews.length;
			const averageRating = listingReviews.reduce((acc, curr) => acc + curr.rating, 0) / reviewCount || 0;
			let prices: { dailyPrice: number; totalPrice: number | null };
			const rooms = await prisma.room.findMany({
				where: {
					listingId: listing.id
				},
				include: {
					pricePeriods: true
				}
			})
			if (rooms.length > 0) {
				prices = this.calculatePrices(rooms[0].pricePeriods, listing.minPrice, bookingInfo.checkIn, bookingInfo.checkOut)
			} else {
				prices = this.calculatePrices(listing.pricePeriods, listing.minPrice, bookingInfo.checkIn, bookingInfo.checkOut)
			}
			calculatedListings.push({
				...this.transformResponse(listing, 'catalog'),
				...prices,
				averageRating: parseFloat(averageRating.toFixed(2)),
				reviewCount,
			})
		}

		if (sortFilters && (sortFilters.priceFrom && sortFilters.priceTo)) {
			//@ts-ignore
			calculatedListings = calculatedListings.filter(listing => listing.dailyPrice >= sortFilters.priceFrom && listing.dailyPrice <= sortFilters.priceTo)
		}

		if (target === 'list') {
			let sortedListings = calculatedListings.sort((a, b) => {
				switch (sortBy) {
					case 'increase':
						//@ts-ignore
						return a.dailyPrice - b.dailyPrice;
					case 'decrease':
						//@ts-ignore
						return b.dailyPrice - a.dailyPrice;
					case 'popularity':
						// Здесь может быть логика сортировки по популярности, например, на основе reviews
						return b.reviewCount - a.reviewCount;
					case 'sea-distance':
						//@ts-ignore
						return a.seaDistance - b.seaDistance;
					default:
						return 0;
				}
			}).filter(listing => {
				const isHotel = listing._count.rooms > 0;
				if (isHotel) {
					return true;
				}
				return listing.places >= bookingInfo.peoples
			});
			const startIndex = (page - 1) * pageSize;
			const endIndex = startIndex + pageSize;
			const paginatedListings = sortedListings.slice(startIndex, endIndex);
			return {
				count: sortedListings.length,
				listings: paginatedListings.map(listing => {
					const {typeId, validated, description, ownerId, managerId, createdAt, coords, note, _count, photos, ...listingData} = listing;
					return {
						...listingData,
						photos: photos.slice(0, 6)
					};
				}),
			};
		} else {
			const listingMapResponse = calculatedListings.filter(listing => {
				const isHotel = listing._count.rooms > 0;
				if (isHotel) {
					return true;
				}
				return listing.places >= bookingInfo.peoples
			});
			return {
				count: listingMapResponse.length,
				listings: listingMapResponse.map(listing => {
					const {address, coords, id, minPrice, totalPrice} = listing;
					return {
						address, coords, id, minPrice, totalPrice
					};
				}),
			};
		}


	}
	async updateListing(listingDto: ListingCreateDTO, id: number, isHotelType: boolean, userRole: 'ADMIN' | 'MANAGER' | 'LANDLORD' | 'TOURIST') {
		const { amenities, managerId, foodOptions, ownerId, flatProperties, photos, places, rooms, pricePeriods, coords, cityId, typeId, ...rest } = listingDto;

		let photosWithPosition = []

		for (let i = 0; i < photos.length; i++) {
			const currentPhoto = {
				...photos[i],
				position: i
			}
			photosWithPosition.push(currentPhoto)
		}


		if (!id) {
			throw new Error("Listing ID is required for update operation.");
		}

		// Обновление объекта жилья
		const updatedListing = await prisma.listing.update({
			where: { id },
			//@ts-ignore
			data: {
				flatProperties: {
					...(flatProperties && {
						update: {...flatProperties}
					})
				},
				...rest,
				places: isHotelType ? 100 : places,
				city: {
					connect: {
						//@ts-ignore
						id: cityId
					}
				},
				type: {
					connect: {
						//@ts-ignore
						id: typeId
					}
				},
				photos: {
					connect: photosWithPosition.map(photo => ({id: photo.photoId})),
				},
				owner: ownerId
					? { connect: { id: ownerId } } // Если ownerId не null, подключаем
					: { disconnect: true },
				manager: {
					...(managerId && {
						connect: {id: managerId}
					})
				},
			},
		});



		for (const listingPhoto of photosWithPosition) {
			await prisma.photo.update({
				where: {id: listingPhoto.photoId},
				data: {
					position: listingPhoto.position
				}
			})
		}

		// Отдельная логика для обновления координат, если они есть
		if (coords) {
			const { longitude, width } = coords;
			const coordsUpdate = await prisma.coords.upsert({
				where: { listingId: id },
				//@ts-ignore
				update: { longitude, width },
				//@ts-ignore
				create: { longitude, width, listingId: id },
			});
		}

		if (pricePeriods.length > 0) {
			await prisma.pricePeriod.deleteMany({
				where: {
					listingId: id
				}
			})
			for (const period of pricePeriods) {
				await prisma.pricePeriod.create({
					data: {
						listingId: id,
						...period
					},
				});
			}
		}

		await prisma.listingAmenity.deleteMany({
			where: {
				listingId: id
			}
		})

		await prisma.listingFood.deleteMany({
			where: {
				listingId: id
			}
		})


		await Promise.all(amenities.map(amenityId => {
			return prisma.listingAmenity.create({
				data: {
					listingId: id,
					amenityId
				}
			})
		}))

		await Promise.all(foodOptions.map(foodId => {
			return prisma.listingFood.create({
				data: {
					listingId: id,
					foodId
				}
			})
		}))

		await prisma.listing.update({
			where: {
				id: updatedListing.id
			},
			data: {
				validated: ['ADMIN', 'MANAGER'].includes(userRole),
			}
		})

		return updatedListing;
	}

	async updateRooms(roomsDto: RoomCreateDTO[], listingId: number) {
		const existingRooms = await prisma.room.findMany({
			where: { listingId },
		});

		if (existingRooms.length > 0) {
			const existingRoomIds = existingRooms.map(room => room.id);
			const newRoomIds = roomsDto.filter(room => room.id).map(room => room.id);
			const roomIdsToDelete = existingRoomIds.filter(id => !newRoomIds.includes(id));

			// Шаг 3: Удаление неактуальных номеров
			await prisma.room.deleteMany({
				where: {
					id: { in: roomIdsToDelete },
				},
			});
		}
		// Шаг 2: Определение номеров, которые необходимо удалить

		for (const room of roomsDto) {
			const { id: roomId, amenities: roomAmenities, photos: roomPhotos, pricePeriods: roomPricePeriods, ...roomData } = room;
			let photosWithPosition = []

			for (let i = 0; i < roomPhotos.length; i++) {
				const currentPhoto = {
					...roomPhotos[i],
					position: i
				}
				photosWithPosition.push(currentPhoto)
			}

			const roomCreateQuery = {
				...roomData,
				pricePeriods: {
					create: roomPricePeriods
				},
				amenities: {
					create: roomAmenities.map(i => ({name: i}))
				},
				listing: {
					connect: {
						id: listingId
					}
				}
			}

			if (roomPhotos.length > 0) {
				//@ts-ignore
				roomCreateQuery.photos = {
					connect: photosWithPosition.map(photo => ({id : photo.photoId}))
				}
			}

			if (roomId) {
				await prisma.pricePeriod.deleteMany({
					where: {
						roomId: roomId,
					},
				});
				await prisma.roomAmenity.deleteMany({
					where: {
						roomId: roomId,
					},
				});
				await prisma.room.update({
					where: { id: roomId },
					data: {
						...roomData,
						listingId,
						pricePeriods: {
							create: roomPricePeriods
						},
						photos: {
							connect: photosWithPosition.map(photo => ({id : photo.photoId}))
						},
						amenities: {
							create: roomAmenities.map(i => ({name: i}))
						}
					},
				});
				for (const listingPhoto of photosWithPosition) {
					await prisma.photo.update({
						where: {id: listingPhoto.photoId},
						data: {
							position: listingPhoto.position
						}
					})
				}
			} else {
				// Создание нового номера
				const createdRoom = await prisma.room.create({
					//@ts-ignore
					data: roomCreateQuery
				});
			}
		}
	}

	async getListingsForModeration() {
		const listings = await prisma.listing.findMany({
			where: {
				validated: false
			},
			include: {
				city: true,
				photos: true,
				amenities: {
					include: {
						amenity: true
					}
				},
				_count: {
					select: {
						rooms: true
					}
				},
			},
		})
		return listings.map(listing => {
			return {
				...this.transformResponse(listing, 'catalog'),
				dailyPrice: listing.minPrice,
				totalPrice: null
			}
		})
	}


	async getFavorites(listingIDs: number[]) {
		const listings = await prisma.listing.findMany({
			where: {
				id: {
					in: listingIDs
				}
			},
			include: {
				city: true,
				photos: true,
				amenities: {
					include: {
						amenity: true
					}
				},
				_count: {
					select: {
						rooms: true
					}
				},
			},
		})
		return listings.map(listing => {
			return {
				...this.transformResponse(listing, 'catalog'),
				dailyPrice: listing.minPrice,
				totalPrice: null
			}
		})
	}

	async getUserListings(id: number) {
		const listings = await prisma.listing.findMany({
			where: {
				ownerId: id
			},
			include: {
				amenities: {
					include: {
						amenity: true
					}
				},
				photos: true,
				city: {
					include: {
						region: true
					}
				},
				_count: {
					select: {
						rooms: true
					}
				},
			}
		})
		const reviews = await prisma.review.findMany({
			where: {
				listingId: {
					in: listings.map(listing => listing.id),
				},
			},
			select: {
				listingId: true,
				rating: true,
			},
		});
		let calculatedListings = [];
		for (const listing of listings) {
			const listingReviews = reviews.filter(review => review.listingId === listing.id);
			const reviewCount = listingReviews.length;
			const averageRating = listingReviews.reduce((acc, curr) => acc + curr.rating, 0) / reviewCount || 0;
			let prices: { dailyPrice: number; totalPrice: number | null };
			const rooms = await prisma.room.findMany({
				where: {
					listingId: listing.id
				},
				include: {
					pricePeriods: true
				}
			})
			prices = {
				dailyPrice: rooms.length > 0 ? rooms[0].minPrice : listing.minPrice,
				totalPrice: null
			}
			calculatedListings.push({
				...this.transformResponse(listing, 'catalog'),
				...prices,
				averageRating: parseFloat(averageRating.toFixed(2)),
				reviewCount,
			})
		}
		return calculatedListings.map(listing => {
			const {typeId, validated, description, ownerId, managerId, createdAt, coords, note, _count, photos, ...listingData} = listing;
			return {
				...listingData,
				validated,
				photos: photos.slice(0, 6)
			};
		})
	}

	async getListingsByIDs(IDs: number[], bookingInfo?: BookingInfoDTO) {
		const listings = await prisma.listing.findMany({
			where: {
				id: {
					in: IDs
				},
				validated: true
			},
			include: {
				amenities: {
					include: {
						amenity: true
					}
				},
				pricePeriods: true,
				photos: true,
				city: {
					include: {
						region: true
					}
				},
				_count: {
					select: {
						rooms: true
					}
				},
			}
		})
		const reviews = await prisma.review.findMany({
			where: {
				listingId: {
					in: listings.map(listing => listing.id),
				},
			},
			select: {
				listingId: true,
				rating: true,
			},
		});
		let calculatedListings = [];
		for (const listing of listings) {
			const listingReviews = reviews.filter(review => review.listingId === listing.id);
			const reviewCount = listingReviews.length;
			const averageRating = listingReviews.reduce((acc, curr) => acc + curr.rating, 0) / reviewCount || 0;
			let prices: { dailyPrice: number; totalPrice: number | null };
			const rooms = await prisma.room.findMany({
				where: {
					listingId: listing.id
				},
				include: {
					pricePeriods: true
				}
			})

			if (rooms.length > 0) {
				prices = this.calculatePrices(rooms[0].pricePeriods, listing.minPrice, bookingInfo ? bookingInfo.checkIn : null, bookingInfo ? bookingInfo.checkOut : null)
			} else {
				prices = this.calculatePrices(listing.pricePeriods, listing.minPrice,bookingInfo ? bookingInfo.checkIn : null, bookingInfo ? bookingInfo.checkOut : null)
			}

			calculatedListings.push({
				...this.transformResponse(listing, 'catalog'),
				...prices,
				averageRating: parseFloat(averageRating.toFixed(2)),
				reviewCount,
			})
		}
		return calculatedListings.map(listing => {
			const {typeId, validated, description, ownerId, managerId, createdAt, coords, note, _count, photos, ...listingData} = listing;
			return {
				...listingData,
				photos: photos.slice(0, 6)
			};
		})
	}
}

export default new ListingsService()