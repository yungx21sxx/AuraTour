<script setup lang="ts">

	import FilterCheckBoxes from "~/modules/Search/components/filters/FilterCheckBoxes.vue";
	import useFilters from "~/modules/Search/composables/useFilters";
	import useCatalog from "~/modules/Search/composables/useCatalog";
	import useBooking from "~/modules/Booking/composables/useBooking";
	import type {FiltersDTO} from "~/modules/Search/types/dto.types";
	import useMapCatalog from "~/modules/Search/composables/useMapCatalog";
	import useSearch from "~/modules/Booking/composables/useSearch";
	import {mdiChevronDown, mdiChevronUp} from "@mdi/js";
	
	const {target = 'catalog'} = defineProps<{
		target?: 'modal' | 'catalog'
	}>();
	
	
	const {
		chosenFilters,
		filtersInitData,
		performNavigation
	} = useFilters();
	
	watch(chosenFilters, async () => {
		if (target === 'catalog') {
			await performNavigation()
		}
	}, {
		deep: true
	})
	
	const showRoomCountFilters = ref(true)
	
	const disabledHousingTypes = [2, 6, 8];
	const roomFiltersDisable = computed(() =>
		chosenFilters.value.housingTypesId.some(id => disabledHousingTypes.includes(id))
	);
	
</script>

<template>
	<form class="filters" aria-label="Фильтры" >
		<div class="filters__price filter">
			<span class="filter__title">Цена за ночь, руб</span>
			<div class="filter__range">
				<v-text-field
					v-model="chosenFilters.priceRange[0]"
					hide-details
					single-line
					type="number"
					density="compact"
					aria-label="sdfsdf"
					:elevation="0"
				></v-text-field>
				<v-text-field
					v-model="chosenFilters.priceRange[1]"
					hide-details
					single-line
					type="number"
					density="compact"
					aria-label="sdfsdf"
					:eletation="0"
				></v-text-field>
			</div>
			<v-range-slider
				v-model="chosenFilters.priceRange"
				:max="filtersInitData.priceTo"
				:min="filtersInitData.priceFrom"
				:step="1"
				hide-details
				aria-label="price range"
				class="align-center"
				color="#7059FF"
				density="compact"
			>
			</v-range-slider>
		</div>
		<FilterCheckBoxes
			title="Типы жилья"
			v-if="filtersInitData"
			:variants="filtersInitData.housingTypes"
			v-model="chosenFilters.housingTypesId"
		/>
		<FilterCheckBoxes
			title="Инфраструктура"
			v-if="filtersInitData"
			:variants="filtersInitData.infrastructure"
			v-model="chosenFilters.infrastructureId"
		/>
		<FilterCheckBoxes
			title="Удобства"
			v-if="filtersInitData"
			:variants="filtersInitData.amenities"
			v-model="chosenFilters.amenitiesId"
		/>
		<FilterCheckBoxes
			title="Питание"
			v-if="filtersInitData"
			:variants="filtersInitData.foods"
			v-model="chosenFilters.foodsId"
		/>
		<div class="filters__title">
			<span>Количество комнат</span>
			<v-btn
				:icon="showRoomCountFilters ? mdiChevronUp : mdiChevronDown"
				@click="showRoomCountFilters = !showRoomCountFilters"
				variant="text"
				aria-label="show"
			></v-btn>
		</div>
		<v-expand-transition>
			<div v-show="showRoomCountFilters">
				<v-radio-group v-model="chosenFilters.minRoomCount" aria-label="sdfdsfdsfdsf" class="filter__radio" :disabled="roomFiltersDisable">
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
		
	</form>
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