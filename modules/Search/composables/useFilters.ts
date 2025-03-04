import type {IQueryBooking} from "~/modules/Booking/types/query.types";
import type {
	FiltersDTO,
	FiltersRefreshBookingInfoDTO,
	GetRefreshedFiltersDTO,
	IFiltersInput
} from "~/modules/Search/types/dto.types";
import type {BookingInfoDTO} from "~/modules/Booking/types/dto.types";
import type {IFiltersResponse} from "~/modules/Search/types/response.types";
import type {LocationQuery} from "vue-router";
import useMapCatalog from "~/modules/Search/composables/useMapCatalog";
import useCatalog from "~/modules/Search/composables/useCatalog";
import useBooking from "~/modules/Booking/composables/useBooking";

export default () => {
	const filtersInitData = useState<IFiltersResponse>('filters-init-data');
	const chosenFilters = useState<IFiltersInput>('chosen-filters');
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
			priceFrom: query.priceFrom ? parseInt(query.priceFrom as string) : null,
			priceTo: query.priceTo ? parseInt(query.priceTo as string) : null,
			amenitiesId: query.amenitiesId ? (Array.isArray(query.amenitiesId) ? query.amenitiesId.map(Number) : [parseInt(query.amenitiesId)]) : [],
			foodsId: query.foodsId ? (Array.isArray(query.foodsId) ? query.foodsId.map(Number) : [parseInt(query.foodsId)]) : [],
			housingTypesId: query.housingTypesId ? (Array.isArray(query.housingTypesId) ? query.housingTypesId.map(Number) : [parseInt(query.housingTypesId)]) : [],
			minRoomCount: query.minRoomCount ? parseInt(query.minRoomCount as string) : null,
			infrastructureId: query.infrastructureId ? (Array.isArray(query.infrastructureId) ? query.infrastructureId.map(Number) : [parseInt(query.infrastructureId)]) : [], //@ts-ignore
		};
	}

	async function fetchBookingFilters(query: IQueryBooking, cityId: number | null) {
		const dto =  {
			cityId: cityId || null,
			checkIn: query.checkIn,
			checkOut: query.checkOut,
			peoples: query.adults
		}

		const data = await $fetch<IFiltersResponse>('/api/filters/filters-first-load', {
			method: 'POST',
			body: dto
		});

		if (data) {
			filtersInitData.value = data;
		}
	}

	function setFiltersFromQuery(filtersFromQuery: FiltersDTO) {
		const {priceFrom, priceTo, minRoomCount,  ...queryParams} = filtersFromQuery;
		chosenFilters.value = {
			priceRange: [priceFrom || filtersInitData.value.priceFrom, priceTo || filtersInitData.value.priceTo],
			...queryParams,
			minRoomCount: minRoomCount || 1,
		}
	}
	async function performNavigation() {
		const {
			setFiltersDTO,
			listingTypeSEOPage,
			cityListingTypeSEOPage,
			isFiltering,
			getRedirectPath,
			filtersDTO,
			debouncedRefreshListingList
		} = useCatalog();
		const {
			getBookingQueryLinkParameters
		} = useBooking()

		setFiltersDTO({
			priceFrom: chosenFilters.value.priceRange[0],
			priceTo: chosenFilters.value.priceRange[1],
			housingTypesId: chosenFilters.value.housingTypesId,
			amenitiesId: chosenFilters.value.amenitiesId,
			foodsId: chosenFilters.value.foodsId,
			minRoomCount: chosenFilters.value.minRoomCount,
			infrastructureId: chosenFilters.value.infrastructureId
		})
		// Опции для навигации
		const navigateOptions = {};

		const seoPage = listingTypeSEOPage.value || cityListingTypeSEOPage.value;

		// if (seoPage) {
		// 	//@ts-ignore
		// 	navigateOptions.external = true;
		// } else {
		// 	isFiltering.value = true;
		// }
		isFiltering.value = true;

		await navigateTo(
			{
				path: getRedirectPath(),
				query: {
					...getBookingQueryLinkParameters.value,
					...filtersDTO.value,
				},
			},
			navigateOptions
		);


		debouncedRefreshListingList();
		const {mapCatalogIsOpen, mapModalIsOpen} = useMapCatalog()
		if (mapCatalogIsOpen.value || mapModalIsOpen.value) {
			await refreshNuxtData('map-listings-list')
		}

	}

	function resetFilters() {
		const {priceFrom, priceTo, ...filtersData} = filtersInitData.value;

		chosenFilters.value = {
			amenitiesId: [], foodsId: [], housingTypesId: [], infrastructureId: [],
			priceRange: [priceFrom, priceTo],
			minRoomCount: 1
		}
	}
	return {
		fetchBookingFilters,
		filtersInitData,
		chosenFilters,
		setFiltersFromQuery,
		performNavigation,
		resetFilters,
		encodeFiltersToQuery,
		parseQueryParams,
		filtersModalIsOpen,
	}
}