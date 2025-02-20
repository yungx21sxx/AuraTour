
import {type IQueryBooking} from "~/modules/Booking/types/query.types";
import {type BookingInfoDTO} from "~/modules/Booking/types/dto.types";
import type  {FiltersDTO, GetAvailableListingsDTO} from "~/modules/Search/types/dto.types";
import {type IListingCatalogResponse, ISeoPage} from "~/modules/Search/types/response.types";
import {useDebounce} from "~/modules/Search/composables/useDebounce";
import type {H3Error} from "h3";


export default () => {
	const bookingDTO = useState<BookingInfoDTO>('booking-dto');
	const filtersDTO = useState<FiltersDTO>('filtersDTO');
	const currentPage = useState<number>('current-page', () => 1);
	const hasMore = useState<boolean>('has-more-listings', () => true);
	const isLoading = useState<boolean>('isLoading', () => false);
	const loadingError = useState<string | null>('loadingError', () => null);
	const isFiltering = useState<boolean>('filtering', () => false);
	const selectedManagerId = useState<number | null>(() => null);

	const listingTypeSEOPage = useState<boolean>('listingTypeSEOPage', () => false);
	const cityListingTypeSEOPage = useState<boolean>('cityListingTypeSEOPage', () => false);
	const seoPage = useState<ISeoPage | null>('seoPage', () => null);

	async function getSeoPage(citySlug: string | null, typeSlug: string | null): Promise<ISeoPage> {
		const data = await $fetch<{data: {seoPage: ISeoPage}}>('/api/listings/seo-page', {
			method: 'GET',
			query: {
				citySlug,
				typeSlug
			}
		})
		//@ts-ignore
		seoPage.value = data.seoPage;
		return data.seoPage
	}

	function getRedirectPath(newCitySlug?: string | null) {
		const route = useRoute()

		const citySlug = route.params.citySlug as string | null;
		const typeSlug = route.params.typeSlug as string | null;

		if (listingTypeSEOPage.value) {
			// Мы находимся на SEO-странице типа жилья (/search/type/(listingTypeSlug))
			if (newCitySlug) {
				// Пользователь выбрал город
				return `/search/city/${newCitySlug}`;
			} else {
				// Пользователь изменил тип жилья (добавил или убрал тип)
				return `/search`;
			}
		} else if (cityListingTypeSEOPage.value) {
			// Мы находимся на SEO-странице города и типа жилья (/search/city/(citySlug)/(listingTypeSlug))

			// При любом изменении (дополнительный тип или смена города) редиректим на /search/city/(citySlug)
			if (citySlug) {
				return `/search/city/${citySlug}`;
			} else {
				return `/search`;
			}
		} else if (citySlug && !typeSlug) {
			// Все остальные случаи
			if (newCitySlug) {
				return `/search/city/${newCitySlug}`;
			} else {
				return `/search/city/${citySlug}`;
			}
		} else if (newCitySlug) {
			return `/search/city/${newCitySlug}`;
		} else if (!citySlug && typeSlug) {
			return `/search/type/${typeSlug}`;
		} else {
			return `/search`
		}
	}
	const listingsListDefault = {
		count: 0,
		listings: []
	}

	const listingsList = useState<IListingCatalogResponse>('catalog-page', () => listingsListDefault)

	const sortBy = useState<'increase' | 'decrease' | 'popularity' | 'sea-distance'>('sort-by', () => 'popularity');

	function createBookingDTO(query: IQueryBooking, citySlug: string | null): BookingInfoDTO {
		bookingDTO.value = {
			citySlug: citySlug,
			checkIn: query.checkIn,
			checkOut: query.checkOut,
			peoples: query.adults
		}
		return bookingDTO.value
	}

	function setFiltersDTO(filters: FiltersDTO) {
		filtersDTO.value = filters;
	}

	function refreshListingList() {
		listingsList.value.listings = [];
		currentPage.value = 1;
		hasMore.value = true;
	}

	const { debounce } = useDebounce();

	const debouncedRefreshListingList = debounce(async () => {
		refreshListingList();
		try {
			const {count, listings} = await fetchCatalog();
			listingsList.value.listings = listings;
			listingsList.value.count = count;
			currentPage.value = 2;
		} catch (error) {
			console.error('Ошибка при загрузке данных:', error);
		} finally {
			isFiltering.value = false;
		}
	}, 400)


	async function loadListings() {
		if (isLoading.value || !hasMore.value) return;
		try {
			const {count, listings} = await fetchCatalog();
			if (listings.length === 0) {
				hasMore.value = false;
				return;
			} else {
				listingsList.value.listings.push(...listings);
				listingsList.value.count = count;
				currentPage.value += 1;
			}
		} catch (error: H3Error) {
			console.error('Ошибка при загрузке данных:', error);
			loadingError.value = error.data.message;
		} finally {
			isLoading.value = false;
		}
	}


	async function fetchCatalog(): Promise<IListingCatalogResponse> {
		//@ts-ignore
		return $fetch(`/api/listings/available?page=${currentPage.value}`, {
			method: 'POST',
			body: {
				booking: bookingDTO.value,
				filters: filtersDTO.value,
				sortBy: sortBy.value,
				managerId: selectedManagerId.value,
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
		listingsList,
		sortBy,
		hasMore,
		refreshListingList,
		debouncedRefreshListingList,
		isFiltering,
		isLoading,
		listingTypeSEOPage,
		cityListingTypeSEOPage,
		filtersDTO,
		getRedirectPath,
		getSeoPage,
		seoPage,
		selectedManagerId
	}
}