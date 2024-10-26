<script setup lang="ts">
	import useBooking from "~/modules/Booking/composables/useBooking";
	import useSearch from "~/modules/Booking/composables/useSearch";
	import useShowListingCount from "~/composables/useShowListingCount";
	import type {ICitySearchItem} from "~/modules/Booking/types/response.types";
	
	function levenshteinDistance(a, b) {
		const matrix = [];
		
		for (let i = 0; i <= b.length; i++) {
			matrix[i] = [i];
		}
		for (let j = 0; j <= a.length; j++) {
			matrix[0][j] = j;
		}
		
		for (let i = 1; i <= b.length; i++) {
			for (let j = 1; j <= a.length; j++) {
				if (b.charAt(i - 1) === a.charAt(j - 1)) {
					matrix[i][j] = matrix[i - 1][j - 1];
				} else {
					matrix[i][j] = Math.min(
						matrix[i - 1][j - 1] + 1, // Замена
						matrix[i][j - 1] + 1,     // Вставка
						matrix[i - 1][j] + 1      // Удаление
					);
				}
			}
		}
		
		return matrix[b.length][a.length];
	}
	const searchQuery = ref<string>('');
	const {searchData, setChosenCityBySlug} = useSearch();
	
	const MAX_DISTANCE = 2;
	const searchResults = computed<ICitySearchItem>(() => {
		if (!searchQuery.value.trim()) {
			return [];
		}
		
		const query = searchQuery.value.toLowerCase();
		
		return searchData.value.cities.filter(city => {
			const cityName = city.cityName.toLowerCase();
			const regionName = city.regionName.toLowerCase();
			
			// Проверяем расстояние Левенштейна между строкой поиска и названиями городов и регионов
			const distanceToCityName = levenshteinDistance(query, cityName);
			const distanceToRegionName = levenshteinDistance(query, regionName);
			
			return (
				distanceToCityName <= MAX_DISTANCE || distanceToRegionName <= MAX_DISTANCE
			);
		});
	});
	
	const {bookingModals} = useBooking();
	
	
	const showListingCount = useShowListingCount()
	

	
	function closeModal() {
		bookingModals.value.location.isOpen = false;
	}
	
	function onCitySelect(slug: string) {
		bookingModals.value.location.slug = slug;
		setChosenCityBySlug(slug);
		closeModal();
	}
	
	
	const {isMobileOrTablet} = useDevice();
	
	
</script>

<template>
	<v-dialog v-model="bookingModals.location.isOpen" :fullscreen="isMobileOrTablet" width="600px">
		<v-card :class="['modal', {
			'modal_desktop': !isMobileOrTablet
		}]">
			<v-card-item>
				<div class="modal__header">
					<v-btn color="#7059FF" icon="mdi-arrow-left-circle-outline" @click="closeModal" variant="tonal"/>
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
						<v-list dense v-if="searchResults.length > 0 || searchQuery.length > 0">
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
								v-for="city in searchData.cities.slice(0,8)"
								:key="city.id"
								elevation="0"
								@click="onCitySelect(city.slug)"
							>
								<div class="search-res">
									<v-icon>mdi-magnify</v-icon>
									<p>
										{{ city.cityName }}, <span>{{ city.regionName }}</span>
									</p>
								</div>
							</v-card>
						</v-list>
					</div>
				</div>
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