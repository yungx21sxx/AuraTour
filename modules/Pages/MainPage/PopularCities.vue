<script setup lang="ts">
	import useSearch from "~/modules/Booking/composables/useSearch";
	import {mdiArrowRight} from "@mdi/js";
	
	const {popularCitiesWithPhoto} = useSearch();
	

	const showListingCount = useShowListingCount()
	function formatVariants(count: number) {
		const wordForms = ["вариант", "варианта", "вариантов"]; // Формы слова для склонения
		let n = Math.abs(count) % 100; // Обработка отрицательных чисел и приведение к диапазону 0-99
		const n1 = n % 10;
		
		if (n > 10 && n < 20) return `${count} ${wordForms[2]}`;
		if (n1 > 1 && n1 < 5) return `${count} ${wordForms[1]}`;
		if (n1 === 1) return `${count} ${wordForms[0]}`;
		
		return `${count} ${wordForms[2]}`;
	}
	

</script>

<template>
	<div class="popular wrapper">
		<h1 class="popular__title">Популярные направления</h1>
		<div class="popular__cities_desktop">
			<v-card
				v-for="city of popularCitiesWithPhoto"
				class="city"
				:href="`/search/city/${city.slug}`"
			>
				<v-img
					:src="city.photo"
					cover
					gradient="to bottom, rgba(0,0,0,0), rgba(0,0,0,.5)"
					height="200px"
				>
					<v-chip color="#7059FF" variant="flat"  class="city__count">от {{city.minPrice}} ₽</v-chip>
					<div class="text-white city__content">
						<div class="city__info">
							<div class="city__title">{{city.cityName}}</div>
							<v-chip variant="tonal" color="#FAAC37"  :append-icon="mdiArrowRight">Смотреть</v-chip>
						</div>
					</div>
					
				</v-img>
			</v-card>
		</div>
		
		<div class="popular__cities_mobile">
			<div
				v-for="city of popularCitiesWithPhoto"
				class="city"
			>
				<v-card :href="`/search/city/${city.slug}`" class="city-mobile-image">
					<v-img aspect-ratio="1" class="city__img" cover :src="city.photo">
						<v-chip color="#7059FF" variant="flat"  class="city__count">от {{city.minPrice}} ₽</v-chip>
					</v-img>
				</v-card>
				
				<h4 class="city__title">{{city.cityName}}</h4>
			</div>
		</div>
		
	</div>
</template>

<style scoped lang="scss">

	.popular {
		margin-top: 42px;
		
		&__title {
			text-align: center;
		}
		.city {
			border-radius: 16px;
		}
		
		
		&__cities_desktop {
			margin-top: 24px;
			display: grid;
			grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
			gap: 16px;
		}
		
		&__cities_mobile {
			display: none;
		}
		
		@media screen and (max-width: 650px){
			
			&__cities_desktop {
				display: none;
			}
			&__cities_mobile {
				display: grid;
				margin-top: 24px;
				grid-template-columns: 1fr 1fr;
				gap: 16px;
			}
			
			&__title {
				font-size: 24px;
			}
		}
		
	}
	
	.popular__cities_mobile .city {
		border-radius: 16px;
		&__img {
			border-radius: 16px;
		}
		h4 {
			margin-top: 7px;
			text-align: center;
		}
		&__count {
			position: absolute;
			top: 8px;
			right: 8px;
			color: #FFFFFF !important;
		}
		.city-mobile-image {
			border-radius: 16px;
		}
	}
	
	.popular__cities_desktop .city {
		position: relative;
		
		
		&__content {
			height: 100%;
			display: flex;
			flex-direction: column;
			justify-content: flex-end;
		}
		
		&__info {
			display: flex;
			
			margin-top: auto;
			align-items: center;
			justify-content: space-between;
			padding: 16px;
		}
		&__title {
			font-size: 24px;
		}
		&__count {
			position: absolute;
			top: 16px;
			right: 16px;
			color: #FFFFFF !important;
		}
	}

</style>