<script setup lang="ts">
	import useBooking from "~/modules/Booking/composables/useBooking";
	import useSearch from "~/modules/Booking/composables/useSearch";
	import type {housingTypesResponse} from "~/modules/Booking/types/response.types";
	import useShowListingCount from "~/composables/useShowListingCount";


	
	const {setType} = defineProps<{
		setType?: boolean
	}>()
	interface SearchResult {
		regionName: string;
		regionId: number;
		cityName: string;
		cityId: number,
		count: number,
		totalCount: number
	}
	
	const {bookingModals, closeLocationModal} = useBooking();
	const {searchQuery, searchResults, popularCities, allCitiesWithListings} = useSearch();
	
	const showListingCount = useShowListingCount()

	
	const housingTypes = ref<housingTypesResponse[]>([]);
	const typesPending = ref(false);
	const step = ref(1)
	const cityListingsCount = ref(0)
	async function onCitySelect(target: SearchResult) {
		if (!setType) {
			closeLocationModal(target);
			step.value = 1
			return;
		}
		bookingModals.value.location.location = target
		cityListingsCount.value = target.count
		step.value = 2
		await fetchHousingTypes(target.cityId)
	}
	async function fetchHousingTypes(cityId: number) {
		typesPending.value = true;
		housingTypes.value = await $fetch<housingTypesResponse[]>(`/api/search/housing-types/${cityId}`);
		typesPending.value = false
	}
	
	async function closeModal() {
		bookingModals.value.location.isOpen = false
		setTimeout(() => {
			step.value = 1
		}, 100)
	}
	
	
	const {isMobileOrTablet} = useDevice();
	
	
</script>

<template>
	<v-dialog v-model="bookingModals.location.isOpen" :fullscreen="isMobileOrTablet" width="600px">
		<v-card :class="['modal', {
			'modal_desktop': !isMobileOrTablet
		}]">
			<v-card-item>
				<v-window v-model="step">
					<v-window-item :value="1">
						<div class="modal__header">
							<v-btn color="#7059FF" icon="mdi-arrow-left-circle-outline" @click="closeLocationModal(null)" variant="tonal"/>
							<h3>Выберите направление</h3>
						</div>
						<div class="modal__search">
							<v-text-field
								v-model="searchQuery"
								placeholder="Введите название города или района"
								prepend-inner-icon="mdi-magnify"
								outlined
							></v-text-field>
							
							<div class="modal__search-res">
								<v-list dense v-if="searchResults || searchQuery.length > 0">
									<v-card
										v-for="(result, index) in searchResults"
										:key="index"
										elevation="0"
										@click="onCitySelect(result)"
									>
										<div class="search-res">
											<v-icon>mdi-magnify</v-icon>
											<div class="search-res__block">
												<p class="search-res__city">{{ result.cityName }}, <span>{{ result.regionName }}</span></p>
												<v-chip class="search-res__count" prepend-icon="mdi-home" v-if="showListingCount">{{result.count}}</v-chip>
											</div>
										</div>
									</v-card>
								</v-list>
								
								<v-list dense v-else>
									<h4>Популярные направления</h4>
									<v-card
										v-for="(result, index) in allCitiesWithListings"
										:key="index"
										elevation="0"
										@click="onCitySelect(result)"
										:disabled="result.count === 0"
									>
										<div class="search-res" :style="{marginBottom: !showListingCount ? '16px' : '8px'}">
											<v-icon>mdi-magnify</v-icon>
											<p>
												{{ result.cityName }}, <span>{{ result.regionName }}</span>
											</p>
											<v-chip
												class="search-res__count"
												color="#818487FF"
												prepend-icon="mdi-home"
												v-if="showListingCount"
											>{{result.count}}</v-chip>
										</div>
									</v-card>
								</v-list>
							</div>
						</div>
					</v-window-item>
					<v-window-item :value="2">
						<div class="modal__header" style="margin-bottom: 0;">
							<v-btn color="#7059FF" icon="mdi-arrow-left-circle-outline" @click="step = 1" variant="tonal"/>
							<h3>Выберите типы жилья</h3>
						</div>
						<div class="modal__search-res">
							<v-list dense v-if="!typesPending">
								<v-checkbox
									v-for="(type, index) in housingTypes"
									v-show="type.count > 0"
									:value="type.id"
									color="#7059FF"
									hide-details
									class="checkbox"
									v-model="bookingModals.location.housingTypesId"
								>
									<template #label>
										<div class="checkbox__label">
											<p style="opacity: 1">{{ type.name }}</p>
										</div>
									</template>
									<template #append>
										<v-chip class="checkbox__count" prepend-icon="mdi-home" v-if="showListingCount">{{type.count}}</v-chip>
									</template>
								</v-checkbox>
								<div class="modal__btns mt-4">
									<v-btn width="100%" class="mt-4" color="#7059FF" @click="closeModal">Продолжить</v-btn>
									<v-btn width="100%" class="mt-4" variant="tonal" color="#7059FF" @click="closeModal">Смотреть все</v-btn>
								</div>
							</v-list>
							<div class="modal__loading" v-else>
								<v-progress-circular color="#7059FF" indeterminate />
							</div>
							
						</div>
					</v-window-item>
				</v-window>

			</v-card-item>
			
		
		</v-card>
	</v-dialog>

</template>

<style scoped lang="scss">
	.modal__loading {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 300px;
	}
	
	h4 {
		margin-bottom: 16px;
		color: $text-gray;
	}
	.modal__header {
		display: flex;
		align-items: center;
		gap: 32px;
		margin-bottom: 32px;
	}
	.search-res {
		display: flex;
		align-items: center;
		gap: 16px;
		padding: 8px;
		margin: 8px 0;
		&__count {
			margin-left: auto;
		}
		
		&__block {
			width: 100%;
			display: flex;
			align-items: center;
		}
		span {
			color: $text-gray;
		}
	}
	
	.checkbox {
		&__label {
			display: flex;
			align-items: center;
			gap: 8px;
			max-width: 500px;
			width: 100%;
			
			justify-content: space-between;
			p {
				opacity: 1 !important;
				color: $text-main !important;
			}
		}
	}
	
	
	.modal_desktop {
		.modal__search-res {
			height: 500px;
			overflow-y: scroll;
		}
	}

</style>