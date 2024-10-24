import type {IQueryBooking} from "~/modules/Booking/types/query.types";
import type {FiltersDTO} from "~/modules/Search/types/dto.types";
import type {BookingInfoDTO} from "~/modules/Booking/types/dto.types";
import type {IFiltersResponse} from "~/modules/Search/types/response.types";
import type {LocationQuery} from "vue-router";

export default () => {
	const filters = useState<IFiltersResponse>();
	const filtersModalIsOpen = useState<boolean>(() => false);
	function encodeFiltersToQuery(filters: FiltersDTO): string {
		const params = new URLSearchParams();
		Object.entries(filters).forEach(([key, value]) => {
			if (Array.isArray(value)) {
				value.forEach(item => params.append(`${key}[]`, item.toString()));
			} else {
				params.set(key, value.toString());
			}
		});
		return params.toString();
	}

	function parseQueryParams(query: LocationQuery): FiltersDTO {
		return {
			priceFrom: parseInt(query.priceFrom as string),
			priceTo: parseInt(query.priceTo as string),
			amenitiesId: query.amenitiesId ? (Array.isArray(query.amenitiesId) ? query.amenitiesId.map(Number) : [parseInt(query.amenitiesId)]) : [],
			foodsId: query.foodsId ? (Array.isArray(query.foodsId) ? query.foodsId.map(Number) : [parseInt(query.foodsId)]) : [],
			housingTypesId: query.housingTypesId ? (Array.isArray(query.housingTypesId) ? query.housingTypesId.map(Number) : [parseInt(query.housingTypesId)]) : [],
			minRoomCount: parseInt(query.minRoomCount as string),
		};
	}

	async function refreshBookingFilters(dto: BookingInfoDTO) {
		const data = await $fetch('/api/filters/filters-first-load', {
			method: 'POST',
			body: dto
		});

		if (data) {
			//@ts-ignore
			filters.value = data;
		}
	}
	async function fetchBookingFilters(query: IQueryBooking) {
		const dto: BookingInfoDTO =  {
			regionId: query.regionId,
			cityId: query.cityId,
			checkIn: query.checkIn,
			checkOut: query.checkOut,
			peoples: query.adults
		}

		const data = await $fetch<IFiltersResponse>('/api/filters/filters-first-load', {
			method: 'POST',
			body: dto
		});

		if (data) {
			filters.value = data;
		}
	}
	return {
		fetchBookingFilters,
		filters,
		encodeFiltersToQuery,
		parseQueryParams,
		filtersModalIsOpen,
		refreshBookingFilters
	}
}