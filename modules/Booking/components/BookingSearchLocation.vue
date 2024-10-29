<script setup lang="ts">
	import useBooking from "~/modules/Booking/composables/useBooking";
	import useSearch from "~/modules/Booking/composables/useSearch";
	import useShowListingCount from "~/composables/useShowListingCount";
	import {mdiMagnify, mdiArrowLeftCircleOutline} from "@mdi/js"
	import type {ICitySearchItem} from "~/modules/Booking/types/response.types";
	
	function levenshteinDistance(a, b) {
		const an = a ? a.length : 0;
		const bn = b ? b.length : 0;
		if (an === 0) return bn;
		if (bn === 0) return an;
		
		const matrix = [];
		
		// Инициализируем первую строку матрицы
		for (let i = 0; i <= bn; i++) {
			matrix[i] = [i];
		}
		// Инициализируем первую колонку матрицы
		for (let j = 0; j <= an; j++) {
			matrix[0][j] = j;
		}
		
		// Заполняем матрицу
		for (let i = 1; i <= bn; i++) {
			for (let j = 1; j <= an; j++) {
				const cost = a[j - 1].toLowerCase() === b[i - 1].toLowerCase() ? 0 : 1;
				matrix[i][j] = Math.min(
					matrix[i - 1][j] + 1,      // Удаление
					matrix[i][j - 1] + 1,      // Вставка
					matrix[i - 1][j - 1] + cost // Замена
				);
			}
		}
		
		return matrix[bn][an];
	}
	
	const searchQuery = ref<string>('');
	const {searchData, setChosenCity} = useSearch();
	
	const searchResults = computed<ICitySearchItem[]>(() => {
		if (!searchQuery.value.trim()) {
			return [];
		}
		
		const query = searchQuery.value.toLowerCase();
		
		const cities = searchData.value.cities
		
		return cities.filter((city) => {
			const cityName = city.cityName.toLowerCase();
			
			// Если название города начинается с поискового запроса
			if (cityName.startsWith(query)) {
				return true;
			}
			
			// Если длина поискового запроса меньше 3 символов, не используем расстояние Левенштейна
			if (query.length < 3) {
				return false;
			}
			
			// Вычисляем расстояние Левенштейна
			const distance = levenshteinDistance(query, cityName);
			const threshold = Math.floor(cityName.length * 0.4); // Пороговое значение
			
			return distance <= threshold;
		});
	});
	
	const {bookingModals} = useBooking();
	
	
	const showListingCount = useShowListingCount()
	

	
	function closeModal() {
		bookingModals.value.location.isOpen = false;
	}
	
	function onCitySelect(city: ICitySearchItem) {
		bookingModals.value.location.slug = city.slug;
		setChosenCity(city)
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
					<v-btn color="#7059FF" :icon="mdiArrowLeftCircleOutline" @click="closeModal" variant="tonal"/>
					<h3>Выберите направление</h3>
				</div>
				<div class="modal__search">
					<v-text-field
						v-model="searchQuery"
						placeholder="Введите название города"
						:prepend-inner-icon="mdiMagnify"
						variant="outlined"
					></v-text-field>
					
					<div class="modal__search-res">
						<v-list dense v-if="searchResults.length > 0 || searchQuery.length > 0">
							<v-card
								v-for="city of searchResults"
								:key="city.id"
								elevation="0"
								@click="onCitySelect(city)"
							>
								<div class="search-res">
									<v-icon :icon="mdiMagnify"></v-icon>
									<div class="search-res__block">
										<p class="search-res__city">{{ city.cityName }}, <span>{{ city.regionName }}</span></p>
										<v-chip class="search-res__count" prepend-icon="mdi-home" v-if="showListingCount">{{city.listingsCount}}</v-chip>
									</div>
								</div>
							</v-card>
						</v-list>
						
						<v-list dense v-else>
							<h4>Популярные направления</h4>
							<v-card
								v-for="city in searchData.cities.slice(0,6)"
								:key="city.id"
								elevation="0"
								@click="onCitySelect(city)"
							>
								<div class="search-res">
									<v-icon :icon="mdiMagnify"></v-icon>
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