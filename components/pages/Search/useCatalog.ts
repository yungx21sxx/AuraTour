import {type IQueryBooking} from "~/types/query.types";
import type {BookingInfoDTO, FiltersDTO, GetAvailableListingsDTO} from "~/types/dto.types";
import type {IListingPreviewResponse, IListingCatalogResponse} from "~/types/response.types";
import type {LocationQuery} from "vue-router";


export default () => {
	const bookingDTO = useState<BookingInfoDTO>('booking-dto');
	const filtersDTO = useState<FiltersDTO | null>('filtersDTO', () => null);
	const currentPage = useState<number>('current-page', () => 1);
	const bookingRawQuery = useState<LocationQuery>()

	const listingsListDefault = {
		count: 0,
		listings: []
	}

	const listingsList = useState<IListingCatalogResponse>('catalog-page', () => shallowReactive(listingsListDefault))

	const sortBy = useState<'increase' | 'decrease' | 'popularity' | 'sea-distance'>('sort-by', () => 'popularity');
	function createBookingDTO(query: IQueryBooking): BookingInfoDTO {
		bookingDTO.value = {
			regionId: query.regionId,
			cityId: query.cityId,
			checkIn: query.checkIn,
			checkOut: query.checkOut,
			peoples: query.adults
		}
		return bookingDTO.value
	}

	function setFiltersDTO(filters: FiltersDTO) {
		filtersDTO.value = filters;
	}

	async function initListings() {
		currentPage.value = 1;
		const {count, listings} = await fetchCatalog();
		listingsList.value.listings = listings;
		listingsList.value.count = count;
	}
	function removeDuplicatesById(objects: IListingPreviewResponse[]): IListingPreviewResponse[] {
		const uniqueObjects = new Map<number, IListingPreviewResponse>();

		objects.forEach(obj => {
			uniqueObjects.set(obj.id, obj); // Map будет хранить только последний объект с данным id
		});

		return Array.from(uniqueObjects.values()); // Преобразуем значения Map обратно в массив
	}

	async function loadListings(
		{ done }: { done: (status: 'loading' | 'error' | 'empty' | 'ok') => void}
	) {
		const {count, listings} = await fetchCatalog();

		if (listings.length === 0) {
			done('empty');
			return;
		}
		listingsList.value.count = count;

		const newListingList = [...listingsList.value.listings, ...listings];

		listingsList.value.listings = removeDuplicatesById(newListingList);
		currentPage.value += 1;

		done('ok');
	}


	async function fetchCatalog(): Promise<IListingCatalogResponse> {
		//@ts-ignore
		return $fetch(`/api/listings/available?page=${currentPage.value}`, {
			method: 'POST',
			body: {
				booking: bookingDTO.value,
				filters: filtersDTO.value,
				sortBy: sortBy.value
			} as GetAvailableListingsDTO
		})
	}

	return {
		createBookingDTO,
		fetchCatalog,
		currentPage,
		bookingDTO,
		setFiltersDTO,
		loadListings,
		initListings,
		listingsList,
		sortBy,
	}
}