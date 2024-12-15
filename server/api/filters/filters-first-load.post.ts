import filtersService from "~/server/service/filters.service";
import {type BookingInfoDTO} from "~/types/dto.types";
export default defineEventHandler(async event => {
	const dto = await readBody<BookingInfoDTO>(event);
	const checkIn = new Date(dto.checkIn);
	const checkOut = new Date(dto.checkOut);
	console.log(checkIn, checkOut)
	try {
		const [housingTypes,{minPrice, maxPrice}, amenities, foods] = await Promise.all([
			filtersService.loadHousingTypes(dto.cityId),
			filtersService.getMinAndMaxPriceForCity(dto.cityId, checkIn, checkOut),
			filtersService.countListingsPerAmenityByCity(dto.cityId),
			filtersService.countListingsPerFoodTypeByCity(dto.cityId)
		])
		return {
			priceFrom: minPrice,
			priceTo: maxPrice,
			housingTypes,
			amenities,
			foods
		}
	} catch (e) {
		console.log(e)
	}

})