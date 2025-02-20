import filtersService from "~/server/service/filters.service";
import type {GetAvailableListingsDTO, GetRefreshedFiltersDTO} from "~/modules/Search/types/dto.types";
import {IFiltersResponse} from "~/modules/Search/types/response.types";
export default defineEventHandler(async event => {
    const {filters, booking} = await readBody<GetRefreshedFiltersDTO>(event);
    try {
        const [housingTypes,{minPrice, maxPrice}, amenities, foods, infrastructure] = await Promise.all([
            filtersService.refreshHousingTypes(booking.cityId, filters),
            filtersService.refreshMinAndMaxPriceForCity(booking.cityId, booking.checkIn, booking.checkOut, filters),
            filtersService.refreshListingsPerAmenityByCity(booking.cityId, filters),
            filtersService.refreshListingsPerFoodTypeByCity(booking.cityId, filters),
            filtersService.refreshListingsPerInfrastructureByCity(booking.cityId, filters)
        ])
        return {
            priceFrom: minPrice,
            priceTo: maxPrice,
            housingTypes,
            amenities,
            foods,
            infrastructure
        }
    } catch (e) {
        console.log(e)
    }

})