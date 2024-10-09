import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async event => {
	const citiesWithCounts = await prisma.city.findMany({
		select: {
			id: true,
			name: true,
			regionId: true,
			_count: {
				select: { listings: true },
			},
			listings: {
				orderBy: {
					minPrice: 'asc'
				},
				take: 1,
				select: {
					minPrice: true
				}
			}
		},
		orderBy: {
			name: 'asc',
		},
	});

	// Получаем регионы с их ID
	const regions = await prisma.region.findMany({
		select: {
			id: true,
			name: true,
		},
		orderBy: {
			name: 'asc',
		},
	});
	const totalCount = await prisma.listing.count();
	// Сопоставляем города с регионами и форматируем вывод, включая общее количество объектов в регионе
	const result = regions.map((region) => {
		const cities = citiesWithCounts
			.filter((city) => city.regionId === region.id && city._count.listings > 0)
			.map((city) => ({
				cityId: city.id,
				cityName: city.name,
				count: city._count.listings,
				minPrice: city.listings[0].minPrice
			}));
		const totalCount = cities.reduce((acc, city) => acc + city.count, 0);

		return {
			regionId: region.id,
			regionName: region.name,
			cities,
			totalCount,
		};
	});


	return {totalCount, result};
})