<template>
	<!-- Меню для изменения информации о бронировании -->
	<HeaderDesktop />
	<div class="catalog wrapper">
		<div class="catalog__sidebar">
			<!-- Сайдбар с фильтрами -->
			<FilterForm />
		</div>
		<div class="catalog__content">
			<div class="catalog__filters">
				<h3 id="listings">Найдено {{ listingsList.count }} вариантов жилья</h3>
				<VSelect
					hide-details
					class="catalog__select"
					:items="sortSelect"
					item-title="text"
					v-model="sortBy"
					density="compact"
				/>
			</div>
			<v-infinite-scroll :onLoad="loadListings">
				<template v-for="listing of listingsList.listings" :key="listing.id">
					<ListingItemCatalog :listing="listing" />
				</template>
				<template v-slot:empty>
					<v-alert type="success">Объекты закончились :(</v-alert>
				</template>
			</v-infinite-scroll>
		</div>
	</div>
	<!-- Модальное окно с фильтрами -->
	<FilterFormModal />
</template>

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
	loadListings,
	listingsList,
	sortBy,
	initListings,
	setFiltersDTO,
} = useCatalog();

const { fetchBookingFilters, parseQueryParams } = useFilters();
const { loadSearchData, setChosenCityBySlug } = useSearch();

// Получаем параметры маршрута
const citySlug = route.params.citySlug as string | undefined;
const typeSlug = route.params.typeSlug as string | undefined;

// Объединяем параметры из маршрута и query
const query = { ...route.query };

// Парсим query параметры, связанные с бронированием
const bookingParameters: IQueryBooking = parseBookingRouteQuery(query);


// Загружаем данные для поиска города
await loadSearchData();

// Устанавливаем данные для бронирования (даты, гости)
setBookingQuery(query);

// Создаем тело запроса на сервер для фильтрации по информации о бронировании
createBookingDTO(bookingParameters);

// Парсим query для фильтрации
const filtersQueryParameters: FiltersDTO = parseQueryParams(query);

// Создаем тело запроса на сервер
setFiltersDTO(filtersQueryParameters);

// Загружаем параметры фильтрации и инициализируем списки
await Promise.all([
	fetchBookingFilters(bookingParameters),
	initListings(),
]);

const sortSelect = [
	{
		text: 'По популярности',
		value: 'popularity',
	},
	{
		text: 'Близость к морю',
		value: 'sea-distance',
	},
	{
		text: 'По возрастанию цены',
		value: 'increase',
	},
	{
		text: 'По убыванию цены',
		value: 'decrease',
	},
];

watch(sortBy, () => {
	initListings();
});


</script>

<style scoped lang="scss">


.catalog {
	display: grid;
	grid-template-columns: 1fr 3fr;
	gap: 16px;
	margin-top: 16px;
	
	&__sidebar {
		background: $bg-card;
		padding: 16px;
		border-radius: 7px;
		height: fit-content;
	}
	&__filters {
		display: flex;
		justify-content: space-between;
		
		width: 100%;
		align-items: center;
	}
	
	&__select {
		display: inline-block;
		max-width: 250px ;
	}
	
	@media screen and (max-width: 950px) {
		margin-top: 16px !important;
		display: block;
		&__sidebar {
			display: none;
		}
	}
	@media screen and (max-width: 600px) {
		&__filters {
			display: block !important;
			margin-bottom: 0 !important;
		}
		&__select {
			max-width: 500px !important;
			width: 100%;
			margin-top: 16px;
		}
		h3 {
			font-weight: 600;
			font-size: 16px;
		}
	}
}
</style>