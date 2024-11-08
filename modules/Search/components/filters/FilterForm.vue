<script setup lang="ts">

	import FilterCheckBoxes from "~/modules/Search/components/filters/FilterCheckBoxes.vue";
	import useFilters from "~/modules/Search/composables/useFilters";
	import useCatalog from "~/modules/Search/composables/useCatalog";
	import useBooking from "~/modules/Booking/composables/useBooking";
	import type {FiltersDTO} from "~/modules/Search/types/dto.types";
	import useMapCatalog from "~/modules/Search/composables/useMapCatalog";
	
	const {filters} = useFilters();
	const {setFiltersDTO, isFiltering, debouncedRefreshListingList, filtersDTO, getRedirectPath, listingTypeSEOPage, cityListingTypeSEOPage} = useCatalog();
	const {getBookingQueryLinkParameters} = useBooking();
	
	//На основной странице котолога парситься query параметры для фильров,
	// если какието из них отсутствуют то поля становяться null
	const {priceFrom, priceTo, minRoomCount,  ...queryParams} = filtersDTO.value;
	
	const chosenHousingTypes = ref([...queryParams.housingTypesId]);
	
	async function performNavigation() {
		const filtersDTO: FiltersDTO = {
			priceFrom: chosenFilters.priceRange[0],
			priceTo: chosenFilters.priceRange[1],
			housingTypesId: chosenHousingTypes.value,
			amenitiesId: chosenFilters.amenitiesId,
			foodsId: chosenFilters.foodsId,
			minRoomCount: chosenFilters.minRoomCount,
		};
		// Опции для навигации
		const navigateOptions = {};
		
		const seoPage = listingTypeSEOPage.value || cityListingTypeSEOPage.value;
		
		if (seoPage) {
			//@ts-ignore
			navigateOptions.external = true;
		} else {
			isFiltering.value = true;
		}
		
		await navigateTo(
			{
				path: getRedirectPath(),
				query: {
					...getBookingQueryLinkParameters.value,
					...filtersDTO,
				},
			},
			navigateOptions
		);
		
		if (!seoPage) {
			setFiltersDTO(filtersDTO);
			debouncedRefreshListingList();
			const {mapCatalogIsOpen, mapModalIsOpen} = useMapCatalog()
			if (mapCatalogIsOpen.value || mapModalIsOpen.value) {
				await refreshNuxtData('map-listings-list')
			}
		}
	}
	
	//Либо берем фильры из query параметров либо начальные данные с сервера
	const filtersInitValue = {
		priceRange: [priceFrom || filters.value.priceFrom, priceTo || filters.value.priceTo],
		...queryParams,
		minRoomCount: minRoomCount || 1,
	}
	
	//Тут все что выбервет пользователь, кроме типов жилья
	const chosenFilters = reactive(filtersInitValue);
	
	//Только типы жилья
	
	watch(chosenHousingTypes, async (updatedFilters) => {
		await performNavigation()
	}, {
		deep: true
	})
	
	watch(chosenFilters, async (updatedFilters) => {
		await performNavigation()
	}, {
		deep: true
	})
	
	const showRoomCountFilters = ref(true)
	
	const disabledHousingTypes = [2, 6, 8];
	const roomFiltersDisable = computed(() =>
		chosenFilters.housingTypesId.some(id => disabledHousingTypes.includes(id))
	);
	
</script>

<template>
	<div class="filters" >
		<div class="filters__price filter">
			<span class="filter__title">Цена за ночь, руб</span>
			<div class="filter__range">
				<v-text-field
					v-model="chosenFilters.priceRange[0]"
					hide-details
					single-line
					type="number"
					density="compact"
					:elevation="0"
				></v-text-field>
				<v-text-field
					v-model="chosenFilters.priceRange[1]"
					hide-details
					single-line
					type="number"
					density="compact"
					
					:eletation="0"
				></v-text-field>
			</div>
			<v-range-slider
				v-model="chosenFilters.priceRange"
				:max="filters?.priceTo"
				:min="filters?.priceFrom"
				:step="1"
				hide-details
				class="align-center"
				color="#7059FF"
				density="compact"
			>
			</v-range-slider>
		</div>
		<FilterCheckBoxes
			title="Типы жилья"
			v-if="filters"
			:variants="filters.housingTypes"
			v-model="chosenHousingTypes"
		/>
		<FilterCheckBoxes
			title="Удобства"
			v-if="filters"
			:variants="filters.amenities"
			v-model="chosenFilters.amenitiesId"
		/>
		<FilterCheckBoxes
			title="Питание"
			v-if="filters"
			:variants="filters.foods"
			v-model="chosenFilters.foodsId"
		/>
		<div class="filters__title">
			<span>Количество комнат</span>
			<v-btn
				:icon="showRoomCountFilters ? 'mdi-chevron-up' : 'mdi-chevron-down'"
				@click="showRoomCountFilters = !showRoomCountFilters"
				variant="text"
			></v-btn>
		</div>
		<v-expand-transition>
			<div v-show="showRoomCountFilters">
				<v-radio-group v-model="chosenFilters.minRoomCount" class="filter__radio" :disabled="roomFiltersDisable">
					<v-radio :value="1">
						<template #label>
							<strong>Неважно</strong>
						</template>
					</v-radio>
					<v-radio :value="2">
						<template #label>
							<strong>2 и более</strong>
						</template>
					</v-radio>
					<v-radio :value="3">
						<template #label>
							<strong>3 и более</strong>
						</template>
					</v-radio>
					<v-radio :value="4">
						<template #label>
							<strong>4 и более</strong>
						</template>
					</v-radio>
				</v-radio-group>
			</div>
		</v-expand-transition>
		
	</div>
</template>

<style scoped lang="scss">
	.filters {
		width: 100%;

		&__title {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-right: -16px;
		}
		
	}
	
	strong {
		font-size: 14px;
	}
	
	.filter {
		
		margin-bottom: 8px;
		&__radio {
			margin-left: -8px;
		}
		&__range {
			display: grid;
			grid-template-columns: 1fr 1fr;
			gap: 16px;
			margin-bottom: 8px;
		}
		&__title {
			margin-bottom: 16px;
			font-weight: 600;
			display: block;
		}
	}

</style>