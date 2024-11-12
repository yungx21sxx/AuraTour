
<script setup lang="ts">
import HeaderDesktop from "~/modules/Search/components/HeaderDesktop.vue";
import FilterForm from "~/modules/Search/components/filters/FilterForm.vue";
import FilterFormModal from "~/modules/Search/components/filters/FilterFormModal.vue";
import ListingItemCatalog from "~/modules/Listing/components/shared/ListingItemCatalog.vue";
import useSearchPageLogic from '~/modules/Search/composables/useSearchPageLogic';
import type {TSearchType} from "~/modules/Search/types/search.types";
import useBooking from '~/modules/Booking/composables/useBooking';
import useSearch from '~/modules/Booking/composables/useSearch';

import useCatalog from '~/modules/Search/composables/useCatalog';
import useFilters from '~/modules/Search/composables/useFilters';

import type { IQueryBooking } from '~/modules/Booking/types/query.types';
import type { FiltersDTO } from '~/modules/Search/types/dto.types';
import ListingItemSceleton from "~/modules/Listing/components/shared/ListingItemSceleton.vue";
import HeaderSEO from "~/modules/Search/components/HeaderSEO.vue";
import {mdiCloseCircle} from "@mdi/js";
import BtnPrimary from "~/modules/Common/UI/BtnPrimary.vue";
import CatalogListingsList from "~/modules/Search/components/CatalogListingsList.vue";
import useMapCatalog from "~/modules/Search/composables/useMapCatalog";
import CatalogListingsMap from "~/modules/Search/components/CatalogListingsMap.vue";
import {map} from "zod";
import CatalogListingsMapModal from "~/modules/Search/components/CatalogListingsMapModal.vue";



const props = withDefaults(
	defineProps<{
		searchType: TSearchType
	}>(),
	{
		searchType: 'ALL'
	}
)
const route = useRoute();
const router = useRouter();

const {
	setBookingQuery,
	parseBookingRouteQuery,
	bookingModals,
	openSetDateModal,
} = useBooking();

const {
	createBookingDTO,
	sortBy,
	setFiltersDTO,
	
	currentPage,
	isLoading,
	listingTypeSEOPage,
	cityListingTypeSEOPage,
	getSeoPage,
	seoPage
} = useCatalog();

const { fetchBookingFilters, parseQueryParams } = useFilters();
const { loadSearchData, setChosenCityBySlug, chosenCity, getChosenTypeBySlug } = useSearch();



// Получаем параметры маршрута
const citySlug = route.params.citySlug as string || null;
const typeSlug = route.params.typeSlug as string || null;

// Объединяем параметры из маршрута и query
const query = { ...route.query };

// Парсим query параметры, связанные с бронированием
const bookingParameters: IQueryBooking = parseBookingRouteQuery(query);


// Загружаем данные для поиска города
await loadSearchData();

setChosenCityBySlug(citySlug);
bookingModals.value.location.slug = citySlug;

// Устанавливаем данные для бронирования (даты, гости)
setBookingQuery(query);

// Создаем тело запроса на сервер для фильтрации по информации о бронировании
createBookingDTO(bookingParameters, citySlug);

// Парсим query для фильтрации
const parsedFilterParams: FiltersDTO = parseQueryParams(query);

if (typeSlug || citySlug) {
	await getSeoPage(citySlug, typeSlug);
}

if (typeSlug && !citySlug) {
	listingTypeSEOPage.value = true;
} else if (typeSlug && citySlug) {
	cityListingTypeSEOPage.value = true;
}

if (typeSlug) {
	const searchedType = getChosenTypeBySlug(typeSlug);
	if (searchedType) {
		parsedFilterParams.housingTypesId = [searchedType.id];
	}
}

// Создаем тело запроса на сервер
setFiltersDTO(parsedFilterParams);


// Загружаем параметры фильтрации и инициализируем списки
await fetchBookingFilters(bookingParameters, chosenCity.value ? chosenCity.value.id : null)

const mapKey = ref(Date.now())
const {mapCatalogIsOpen} = useMapCatalog();

watch(mapCatalogIsOpen, () => {
	mapKey.value = Date.now()
	console.log(mapKey.value)
})

</script>
<template>
	<!-- Меню для изменения информации о бронировании -->
	<HeaderSEO v-if="seoPage"/>
	<HeaderDesktop v-else />
	<div class="catalog wrapper">
		<div class="catalog__sidebar">
			<!-- Сайдбар с фильтрами -->
			<FilterForm />
		</div>
		<div class="catalog__content">
			<CatalogListingsMap :key="mapKey" v-if="mapCatalogIsOpen"/>
			<CatalogListingsList v-else/>
		</div>
		
		
		
	</div>
	<!-- Модальное окно с фильтрами -->
	<FilterFormModal />
	<CatalogListingsMapModal/>
</template>


<style scoped lang="scss">

.catalog {
	display: grid;
	grid-template-columns: 1fr 3fr;
	gap: 16px;
	margin-top: 32px;
	
	&__sidebar {
		background: $bg-card;
		padding: 16px;
		border-radius: 16px;
		height: fit-content;
	}
	
	@media screen and (max-width: 950px) {
		margin-top: 16px !important;
		display: block;
		&__sidebar {
			display: none;
		}
	}
}


</style>