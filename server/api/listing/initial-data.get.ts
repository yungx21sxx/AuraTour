import {prisma} from "~/server/service/prisma.service";
import type {InitialDataResponse} from "~/types/response.types";
export default defineEventHandler(async (event): Promise<InitialDataResponse> => {
	// Получение данных из базы данных
	const cities = await prisma.city.findMany({
		select: {
			id: true,
			name: true,
			regionId: true,
		},
	});

	const amenities = await prisma.amenity.findMany({
		select: {
			id: true,
			name: true,
			value: true,
		},
	});

	const foodOptions = await prisma.food.findMany({
		select: {
			id: true,
			name: true,
			value: true,
		},
	});

	const housingTypes = await prisma.listingType.findMany({
		select: {
			id: true,
			name: true,
			value: true,
		},
	});


	// Формирование ответа
	const response: InitialDataResponse = {
		cities,
		amenities,
		foodOptions,
		housingTypes
	};

	return response;
});