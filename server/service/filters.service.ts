import {prisma} from "~/server/service/prisma.service";
import type {PricePeriod} from "@prisma/client";
import listingsService from "~/server/service/listings.service";

class FiltersService {


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
	async getMinAndMaxPriceForCity(cityId: number | null, startDate: Date, endDate: Date) {

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
		// Возвращаем результат
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