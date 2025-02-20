import {prisma} from "~/server/service/prisma.service";
import type {PricePeriod} from "@prisma/client";
import listingsService from "~/server/service/listings.service";
import {FiltersDTO} from "~/modules/Search/types/dto.types";

// interface BookingInfoDTO {
// 	citySlug: string | null;
// 	checkIn: Date,
// 	checkOut: Date,
// 	peoples: number
// }

// interface FiltersDTO {
// 	priceFrom: number,
// 	priceTo: number,
// 	amenitiesId: number[],
// 	foodsId: number[],
// 	housingTypesId: number[],
// 	minRoomCount: number;
// 	infrastructureId: number[]
// }
//

class FiltersService {
	private buildFilterQuery(filters: FiltersDTO, exclude: string[] = []) {
		const where: any = {
			AND: []
		};

		// Базовые условия
		where.validated = true;

		// Фильтр по цене
		if (!exclude.includes('price')) {
			const priceConditions = [];
			if (filters.priceFrom) priceConditions.push({ minPrice: { gte: filters.priceFrom } });
			if (filters.priceTo) priceConditions.push({ minPrice: { lte: filters.priceTo } });
			if (priceConditions.length > 0) where.AND.push({ AND: priceConditions });
		}

		// Фильтр по удобствам (требуем ВСЕ выбранные аментисы)
		if (!exclude.includes('amenitiesId') && filters.amenitiesId.length > 0) {
			where.AND.push({
				amenities: {
					every: {
						amenityId: { in: filters.amenitiesId }
					}
				}
			});
		}

		// Аналогично для других M2M отношений
		if (!exclude.includes('infrastructureId') && filters.infrastructureId.length > 0) {
			where.AND.push({
				infrastructure: {
					every: {
						infrastructureId: { in: filters.infrastructureId }
					}
				}
			});
		}

		if (!exclude.includes('foodsId') && filters.foodsId.length > 0) {
			where.AND.push({
				food: {
					every: {
						foodId: { in: filters.foodsId }
					}
				}
			});
		}

		// Для типов жилья
		if (!exclude.includes('housingTypesId') && filters.housingTypesId.length > 0) {
			where.AND.push({
				typeId: { in: filters.housingTypesId }
			});
		}

		return where;
	}


	async refreshHousingTypes(cityId: number | null, filters: FiltersDTO) {
		const allTypes = await prisma.listingType.findMany();
		const counts = [];

		for (const type of allTypes) {
			const filterQuery = this.buildFilterQuery(
				{ ...filters, housingTypesId: filters.housingTypesId.filter(id => id !== type.id) },
				['housingTypesId']
			);

			const count = await prisma.listing.count({
				where: {
					...filterQuery,
					cityId: cityId || undefined,
					typeId: type.id
				}
			});

			counts.push({
				...type,
				count
			});
		}

		return counts;
	}

	async refreshListingsPerAmenityByCity(cityId: number | null, filters: FiltersDTO) {
		const amenities = await prisma.amenity.findMany();
		const counts = [];

		for (const amenity of amenities) {
			const filterQuery = this.buildFilterQuery(
				{ ...filters, amenitiesId: filters.amenitiesId.filter(id => id !== amenity.id) },
				['amenitiesId']
			);

			const count = await prisma.listing.count({
				where: {
					...filterQuery,
					cityId: cityId || undefined,
					amenities: {
						some: {
							amenityId: amenity.id
						}
					}
				}
			});

			counts.push({
				...amenity,
				count
			});
		}

		return counts;
	}

	async refreshListingsPerFoodTypeByCity(cityId: number | null, filters: FiltersDTO) {
		const foods = await prisma.food.findMany();
		const counts = [];

		for (const food of foods) {
			const filterQuery = this.buildFilterQuery(
				{ ...filters, foodsId: filters.foodsId.filter(id => id !== food.id) },
				['foodsId']
			);

			const count = await prisma.listing.count({
				where: {
					...filterQuery,
					cityId: cityId || undefined,
					food: {
						some: {
							foodId: food.id
						}
					}
				}
			});

			counts.push({
				...food,
				count
			});
		}

		return counts;
	}

	async refreshListingsPerInfrastructureByCity(cityId: number | null, filters: FiltersDTO) {
		const infrastructures = await prisma.infrastructure.findMany();
		const counts = [];

		for (const infra of infrastructures) {
			const filterQuery = this.buildFilterQuery(
				{ ...filters, infrastructureId: filters.infrastructureId.filter(id => id !== infra.id) },
				['infrastructureId']
			);

			const count = await prisma.listing.count({
				where: {
					...filterQuery,
					cityId: cityId || undefined,
					infrastructure: {
						some: {
							infrastructureId: infra.id
						}
					}
				}
			});

			counts.push({
				...infra,
				count
			});
		}

		return counts;
	}

	async refreshMinAndMaxPriceForCity(cityId: number | null, startDate: Date | null, endDate: Date | null, filters: FiltersDTO) {
		const where = {
			...(cityId ? { cityId } : {}),
			...this.buildFilterQuery(filters),
			validated: true
		};

		const listings = await prisma.listing.findMany({
			where,
			include: {
				pricePeriods: true,
				rooms: { include: { pricePeriods: true } }
			}
		});

		let minPrice: number | null = null;
		let maxPrice: number | null = null;

		listings.forEach(listing => {
			const pricePeriods = listing.rooms.length > 0
				? listing.rooms[0].pricePeriods
				: listing.pricePeriods;

			const listingMinPrice = listing.rooms.length > 0
				? listing.rooms[0].minPrice
				: (listing as any).minPrice;

			const { dailyPrice } = listingsService.calculatePrices(
				pricePeriods,
				listingMinPrice,
				startDate,
				endDate
			);

			if (minPrice === null || dailyPrice < minPrice) minPrice = dailyPrice;
			if (maxPrice === null || dailyPrice > maxPrice) maxPrice = dailyPrice;
		});

		return { minPrice, maxPrice };
	}

	async loadHousingTypes(cityId: number | null) {
		try {
			// Сначала получим ID города по его названию
			const allTypes = await prisma.listingType.findMany({
				select: {
					id: true,
					name: true,
					value: true, // Предполагаем, что это поле тоже нужно включить
				}
			});
			// Для каждого типа жилья подсчитываем количество объектов в указанном городе
			const countsByType = await Promise.all(allTypes.map(async (type) => {
				const query = cityId ? {
					typeId: type.id,
					cityId: cityId,
				} : {typeId: type.id}

				const count = await prisma.listing.count({
					where: {
						...query,
						validated: true
					},
				});
				return {
					id: type.id,
					name: type.name,
					value: type.value,
					count: count,
				};
			}));

			return countsByType;
		} catch (error) {
			console.error('Произошла ошибка при подсчёте объектов:', error);
		}

	}
	toUTCStartOfDay(dateString: Date) {
		const date = new Date(dateString);
		return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
	}
	async getMinAndMaxPriceForCity(cityId: number | null, startDate: Date | null, endDate: Date | null) {
		const query = cityId ? {
			cityId: cityId,
		} : {}

		const listings = await prisma.listing.findMany({
			where: {
				...query,
				validated: true
			},
			include: {
				pricePeriods: true,
				type: true,
				rooms: {
					include: {
						pricePeriods: true
					}
				}
			},
		});

		// Инициализируем переменные для хранения минимальной и максимальной цен
		let minPrice: number | null = null;
		let maxPrice: number | null = null;

		listings.forEach(listing => {
			let pricePeriods: PricePeriod[];
			let listingMinPrice: number;
			if (listing.rooms.length > 0) {
				pricePeriods = listing.rooms[0].pricePeriods;
				listingMinPrice = listing.rooms[0].minPrice
			} else {
				pricePeriods = listing.pricePeriods
				//@ts-ignore
				listingMinPrice = listing.minPrice
			}

			const {dailyPrice} = listingsService.calculatePrices(pricePeriods, listingMinPrice, startDate, endDate );

			if (minPrice === null || dailyPrice < minPrice) {
				minPrice = dailyPrice;
			}


			if (maxPrice === null || dailyPrice > maxPrice) {
				maxPrice = dailyPrice;
			}
		});
		return { minPrice, maxPrice };
	}
	async countListingsPerAmenityByCity(cityId: number | null) {
		const amenities = await prisma.amenity.findMany();
		const counts = [];

		for (const amenity of amenities) {
			// Для каждого удобства подсчитываем количество связанных объектов аренды в указанном городе
			const count = await prisma.listingAmenity.count({
				where: {
					amenityId: amenity.id,
					listing: cityId ? {
						cityId: cityId,
					} : {},
				},

			});

			counts.push({
				id: amenity.id,
				name: amenity.name,
				value: amenity.value,
				count: count,
			});
		}

		return counts;
	}

	async countListingsPerInfrastructureByCity(cityId: number | null) {
		const infrastructures = await prisma.infrastructure.findMany();
		const counts = [];

		for (const infrastructure of infrastructures) {
			// Для каждого удобства подсчитываем количество связанных объектов аренды в указанном городе
			const count = await prisma.listingInfrastructure.count({
				where: {
					infrastructureId: infrastructure.id,
					listing: cityId ? {
						cityId: cityId,
					} : {},
				},
			});

			counts.push({
				id: infrastructure.id,
				name: infrastructure.name,
				value: infrastructure.value,
				count: count,
			});
		}

		return counts;
	}
	async countListingsPerFoodTypeByCity(cityId: number | null) {
		const foods = await prisma.food.findMany();
		const counts = [];

		for (const food of foods) {
			// Для каждого удобства подсчитываем количество связанных объектов аренды в указанном городе
			const count = await prisma.listingFood.count({
				where: {
					foodId: food.id,
					listing: cityId ? {
						cityId: cityId,
					} : {},
				},
			});

			counts.push({
				id: food.id,
				name: food.name,
				value: food.value,
				count: count,
			});
		}

		return counts;
	}
}

export default new FiltersService()