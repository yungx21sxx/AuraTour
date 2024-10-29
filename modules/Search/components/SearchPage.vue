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
			<div class="catalog__filters">
				<h3 id="listings">Найдено {{ listingsList.count }} вариантов жилья</h3>
				<VSelect
					hide-details
					class="catalog__select"
					:items="sortSelect"
					item-title="text"
					v-model="sortBy"
					density="compact"
					variant="outlined"
				/>
			</div>
			
			<template v-if="isFiltering">
				<ListingItemSceleton v-for="n in 5" :key="n"/>
			</template>
			
			<template v-else v-for="listing in listingsList.listings" :key="listing.id">
				<ListingItemCatalog :listing="listing" />
			</template>
			
			<div v-if="isLoading && hasMore && !isFiltering" class="loading-indicator">
				<v-progress-circular
					color="#7059FF"
					indeterminate
				></v-progress-circular>
			</div>
			
			<!-- Элемент-наблюдатель для Intersection Observer -->
			<div v-if="hasMore && !isFiltering" ref="observer" class="observer">
				sdfdsfdsfsdf
			</div>
			<!-- Сообщение об окончании списка -->
			<div v-else-if="!hasMore && !isFiltering">
				<v-alert
					title="Объекты закончились"
					type="success"
				></v-alert>
			</div>
			
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
import ListingItemSceleton from "~/modules/Listing/components/shared/ListingItemSceleton.vue";
import HeaderSEO from "~/modules/Search/components/HeaderSEO.vue";



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
	setFiltersDTO,
	refreshListingList,
	fetchCatalog,
	currentPage,
	hasMore,
	isFiltering,
	isLoading,
	debouncedRefreshListingList,
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

watch(sortBy, async () => {
	debouncedRefreshListingList()
});

const { data: initialData, error: initialError } = await useAsyncData('initialCatalog', () => fetchCatalog());

console.log('SSR отрисовка')
// Обработка ошибки при загрузке данных на сервере
if (initialError.value) {
	console.error('Ошибка при загрузке данных на сервере:', initialError.value);
}

// Инициализируем данные
if (initialData.value) {
	listingsList.value.listings = initialData.value.listings;
	listingsList.value.count = initialData.value.count;
	currentPage.value = 2; // Устанавливаем следующую страницу для загрузки
}

const observer = ref(null);
let intersectionObserver: IntersectionObserver;

onMounted(() => {
	// Инициализируем IntersectionObserver
	intersectionObserver = new IntersectionObserver((entries) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				loadListings();
			}
		});
	});
	
	// Наблюдаем за элементом, если он доступен
	if (observer.value) {
		intersectionObserver.observe(observer.value);
	}
});

// Отслеживаем изменения в observer.value
watch(
	observer,
	(newVal, oldVal) => {
		// Прекращаем наблюдение за старым элементом
		if (oldVal) {
			intersectionObserver.unobserve(oldVal);
		}
		// Наблюдаем за новым элементом
		if (newVal) {
			intersectionObserver.observe(newVal);
		}
	},
	{ flush: 'post' } // Обеспечиваем, что DOM обновлен перед запуском наблюдателя
);

onBeforeUnmount(() => {
	// Очищаем наблюдатель
	if (intersectionObserver && observer.value) {
		intersectionObserver.unobserve(observer.value);
	}
});

</script>

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
	&__filters {
		display: flex;
		justify-content: space-between;
		margin-bottom: 16px;
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
			margin-bottom: 16px;
		}
		h3 {
			font-weight: 600;
			font-size: 16px;
		}
	}
	@media screen and (max-width: 450px){
		&__filters {
			margin-top: 24px;
		}
	}
}

.loading-indicator {
	display: flex;
	justify-content: center;
	margin-top: 24px;
}
</style>