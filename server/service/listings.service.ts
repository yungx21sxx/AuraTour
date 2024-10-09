import type {
	BookingInfoDTO,
	FiltersDTO,
	GetAvailableListingsDTO,
	ListingCreateDTO,
	RoomCreateDTO
} from "~/types/dto.types";
import {prisma} from "~/server/service/prisma.service";
import type {Listing, PricePeriod, Prisma, Room} from "@prisma/client";

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

		if (!checkOut || !checkIn || !pricePeriods) {
			return {
				totalPrice: null,
				dailyPrice: minPrice
			}
		}

		//@ts-ignore
		const start = new Date(checkIn);
		//@ts-ignore
		const end = new Date(checkOut);
		let totalDays = 0;
		let totalPrice = 0;

		for (const period of pricePeriods) {
			const periodStart = new Date(period.startDate);
			const periodEnd = new Date(period.endDate);

			// Найти пересечение периода бронирования с периодом цены
			const latestStart = new Date(Math.max(periodStart.getTime(), start.getTime()));
			const earliestEnd = new Date(Math.min(periodEnd.getTime(), end.getTime()));
			const delta = (earliestEnd.getTime() - latestStart.getTime()) / (1000 * 60 * 60 * 24);

			// Если есть пересечение, добавляем к общему количеству дней и общей цене
			if (delta > 0) {
				const days = Math.ceil(delta); // Включаем обе границы
				totalDays += days;
				totalPrice += days * period.price;
			}
		}

		// Если общее количество дней меньше, чем забронированный период (минимальная цена не использовалась)
		const bookingDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
		if (totalDays < bookingDays) {
			const remainingDays = bookingDays - totalDays;
			totalDays += remainingDays;
			totalPrice += remainingDays * minPrice;
		}

		const dailyPrice = totalPrice / totalDays;
		return {
			dailyPrice: Math.trunc(dailyPrice),
			totalPrice
		};

	}

	async getSimilarListings(typeId: number, listingId: number) {
		const listings = await prisma.listing.findMany({
			where: { typeId },
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
			take: 20
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


	async searchFilteredListings(bookingInfo: BookingInfoDTO, sortFilters: FiltersDTO | null, sortBy: GetAvailableListingsDTO['sortBy'],  page: number) {
		const pageSize: number = 10;


		let queryConditions = bookingInfo.cityId ? {
			cityId: bookingInfo.cityId,
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
		let listings = await prisma.listing.findMany({
			where: queryConditions,
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
			const isHotel = listing.typeId === 2 || listing.typeId === 6 || listing.typeId === 8;
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
			listings: paginatedListings,
		};

	}
	async updateListing(listingDto: ListingCreateDTO, listingPlaces: number) {
		const { id, amenities, foodOptions, photos, places, pricePeriods, coords, cityId, typeId, ...rest } = listingDto;

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
				...rest,
				places: listingPlaces,
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
						price: period.price,
						startDate: new Date(period.startDate),
						endDate: new Date(period.endDate),
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
}

export default new ListingsService()