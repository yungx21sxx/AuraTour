<script setup lang="ts">
	
	//сделать 2 версии формы, одна для ПК, 2 для мобилок. Для мобилок добавим
	
	import FilterCheckBoxes from "~/components/pages/Search/FilterCheckBoxes.vue";
	import useFilters from "~/components/pages/Search/useFilters";
	import useCatalog from "~/components/pages/Search/useCatalog";
	import useBooking from "~/components/Booking/useBooking";
	import type {FiltersDTO} from "~/types/dto.types";
	import debounce from "lodash.debounce";
	import useShowListingCount from "~/composables/useShowListingCount";
	
	const {filters, encodeFiltersToQuery, parseQueryParams} = useFilters();
	const {setFiltersDTO, initListings} = useCatalog()
	const {getBookingQueryLinkParameters} = useBooking()
	const costRange = shallowRef([3200, 12000]);
	
	const route = useRoute()
	
	
	
	const filtersQueryParameters: FiltersDTO = parseQueryParams(route.query);
	setFiltersDTO(filtersQueryParameters);
	
	const {priceFrom, priceTo, minRoomCount, ...queryParams} = filtersQueryParameters;
	
	const filtersInitValue = {
		priceRange: [priceFrom || filters.value.priceFrom, priceTo || filters.value.priceTo],
		...queryParams,
		minRoomCount: 1,
	}
	
	const chosenFilters = reactive(filtersInitValue);
	
	
	watch(filters, () => {
		chosenFilters.priceRange = [filters.value.priceFrom,filters.value.priceTo]
	})
	
	watch(chosenFilters, debounce(async (updatedFilters) => {
		const filtersDTO: FiltersDTO = {
			priceFrom: updatedFilters.priceRange[0],
			priceTo: updatedFilters.priceRange[1],
			housingTypesId: updatedFilters.housingTypesId,
			amenitiesId: updatedFilters.amenitiesId,
			foodsId: updatedFilters.foodsId,
			minRoomCount: updatedFilters.minRoomCount
		}
		await navigateTo({
			path: '/search',
			query: {
				...getBookingQueryLinkParameters.value,
				...filtersDTO
			}
		})
		setFiltersDTO(filtersDTO);
		await initListings();
	}, 200), {
		deep: true
	})
	
	const roomFiltersDisable = computed(() => chosenFilters.housingTypesId.includes(2) || chosenFilters.housingTypesId.includes(6) || chosenFilters.housingTypesId.includes(8))
	
	const showTypes = ref(true);
	
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
				></v-text-field>
				<v-text-field
					v-model="chosenFilters.priceRange[1]"
					hide-details
					single-line
					type="number"
					density="compact"
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
			v-model="chosenFilters.housingTypesId"
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
				:icon="showTypes ? 'mdi-chevron-up' : 'mdi-chevron-down'"
				@click="showTypes = !showTypes"
				variant="text"
			></v-btn>
		</div>
		<v-expand-transition>
			<div v-show="showTypes">
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