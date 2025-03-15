<script setup lang="ts">

import {mdiCloseCircle, mdiMapOutline} from "@mdi/js";
import ListingItemSceleton from "~/modules/Listing/components/shared/ListingItemSceleton.vue";
import BtnPrimary from "~/modules/Common/UI/BtnPrimary.vue";
import ListingItemCatalog from "~/modules/Listing/components/shared/ListingItemCatalog.vue";
import useCatalog from "~/modules/Search/composables/useCatalog";
import useMapCatalog from "~/modules/Search/composables/useMapCatalog";
import CatalogListingsMapModal from "~/modules/Search/components/CatalogListingsMapModal.vue";
import {useAuthUser} from "~/modules/Auth/composables/useAuthUser";
import useAdmin from "~/modules/Auth/composables/useAdmin";

const {listingsList, sortBy, selectedManagerId, isLoading, isFiltering, debouncedRefreshListingList, hasMore, loadListings, fetchCatalog, currentPage} = useCatalog();

const authUser = useAuthUser();

const isAdmin = useAdmin();

const {data: managers} = await useFetch('/api/users/load-managers');


const sortSelect = computed(() => {
	let sortSelect = [
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
	if (isAdmin) {
		sortSelect = [
			{
				text: 'Последние',
				value: 'last',
			},
			{
				text: 'Самые старые',
				value: 'early',
			},
			...sortSelect,
		]
	}
	return sortSelect;
})



const { data: initialData, error: initialError } = await useAsyncData('initialCatalog', () => fetchCatalog());

watch([sortBy, selectedManagerId], async () => {
	isFiltering.value = true
	debouncedRefreshListingList();
});

// Обработка ошибки при загрузке данных на сервере
if (initialError.value) {
	console.error('Ошибка при загрузке данных на сервере:', initialError.value);
}


// Инициализируем данные
if (initialData.value && listingsList.value.listings.length === 0) {
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

const {mapCatalogIsOpen, mapModalIsOpen} = useMapCatalog()

</script>

<template>
	<div class="catalog__content">
		<div class="catalog__filters">
			<h2 id="listings" class="catalog__title">Найдено {{ listingsList.count }} вариантов жилья</h2>
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
		<v-select
			clearable
			:items="managers"
			v-model="selectedManagerId"
			v-if="isAdmin"
			item-title="fullName"
			item-value="id"
			label="Администратор"
		/>
		
		<div class="map">
			<img src="/map.png" alt="map">
			<div class="map__info">
				<h3 class="map__title mb-2">
					Найди лучшее жилье на карте!
				</h3>
				<p class="mb-4">Смотрите на карте цены на соседние объекты, близость к пляжам и выбирайте лучшее предложение</p>
				<BtnPrimary class="btn-desktop" @click="mapCatalogIsOpen = true">Показать на карте</BtnPrimary>
			</div>
			<v-icon :icon="mdiCloseCircle"></v-icon>
		</div>
		<BtnPrimary @click="mapModalIsOpen = true" block :prepend-icon="mdiMapOutline" class="map__btn-mobile mb-8">Показать на карте</BtnPrimary>
		
		<div v-if="isFiltering">
			<ListingItemSceleton v-for="n in 5" :key="n"/>
		</div>
		
		<div v-else>
			<ListingItemCatalog
				itemtype="https://schema.org/LodgingBusiness"
				v-for="listing in listingsList.listings"
				:listing="listing"
				:key="listing.id"
			/>
		</div>
		<div v-if="hasMore && !isFiltering" class="loading-indicator">
			<v-progress-circular
				color="#7059FF"
				indeterminate
			></v-progress-circular>
		</div>
		<div v-if="hasMore && !isFiltering && !isLoading" ref="observer" class="observer">
		</div>
		<!-- Элемент-наблюдатель для Intersection Observer -->
	
		<!-- Сообщение об окончании списка -->
		<div v-else-if="!hasMore && !isFiltering">
			<v-alert
				title="Объекты закончились"
				type="success"
			></v-alert>
		</div>
	
	</div>
</template>

<style scoped lang="scss">

.observer {
	height: 30px;
}


.map {
	display: flex;
	background: #F1F3F9;
	border-radius: 16px;
	padding: 10px;
	gap: 10px;
	margin-bottom: 16px;
	img {
		height: 125px;
		width: auto;
	}
	
	&__btn-mobile {
		display: none;
		max-width: 400px;
	}
	
	@media screen and (max-width: 500px){
		padding: 16px;
		display: none;
		&__btn-mobile {
			display: flex;
		}
		p {
			font-size: 14px;
		}
		
	}
}

.loading-indicator {
	display: flex;
	justify-content: center;
	margin-top: 24px;
}

.catalog {
	&__filters {
		display: flex;
		justify-content: space-between;
		margin-bottom: 16px;
		width: 100%;
		align-items: center;
	}
	
	&__title {
		font-size: 18px;
		font-weight: 600;
		color: $text-gray;
	}
	
	&__select {
		display: inline-block;
		max-width: 250px;
	}
	
	@media screen and (max-width: 950px) {
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

</style>