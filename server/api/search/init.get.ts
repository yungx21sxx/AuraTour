import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async event => {
	const citiesWithCounts = await prisma.city.findMany({
		where: {
			listings: {
				some: {} // Это условие гарантирует, что будут выбраны только те города, у которых есть хотя бы один объект
			}
		},
		include: {
			_count: {
				select: { listings: true },
			},
			region: true,
			listings: {
				orderBy: {
					minPrice: 'asc'
				},
				take: 1,
				select: {
					minPrice: true
				}
			},
			seoPages: true
		},
	});

	const typesWithCounts = await prisma.listingType.findMany({
		include: {
			_count: {
				select: {listings: true},
			},
			listings: {
				orderBy: {
					minPrice: 'asc'
				},
				take: 1,
				select: {
					minPrice: true
				}
			},
			seoPages: true
		},
	})


	const cities = citiesWithCounts.map(city => ({
		id: city.id,
		cityName: city.name,
		regionName: city.region.name,
		slug: city.slug,
		listingsCount: city._count.listings,
		minPrice: city.listings[0].minPrice,
		seoPage: city.seoPages.length > 0
	})).sort((a, b) => b.listingsCount - a.listingsCount);

	const listingTypes = typesWithCounts.map(type => ({
		id: type.id,
		name: type.name,
		slug: type.value,
		listingsCount: type._count.listings,
		minPrice: type.listings[0].minPrice,
		seoPage: type.seoPages.length > 0
	})).sort((a, b) => b.listingsCount - a.listingsCount);
	return {
		cities,
		listingTypes,
	}

})