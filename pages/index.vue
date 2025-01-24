<script setup lang="ts">


import BookingBanner from "~/modules/Pages/MainPage/BookingBanner.vue";
import PopularCities from "~/modules/Pages/MainPage/PopularCities.vue";
import Advantages from "~/modules/Pages/MainPage/Advantages.vue";
import useSearch from "~/modules/Booking/composables/useSearch";
import PromoBanner from "~/modules/Pages/MainPage/PromoBanner.vue";
import PassListingBanner from "~/modules/Pages/MainPage/PassListingBanner.vue";
import HousingTypesLoader from "~/modules/Pages/MainPage/HousingTypesLoader.vue";
import {hydrateOnVisible, defineAsyncComponent} from "vue";
import CallBackForm from "~/modules/Common/CallBackForm.vue";
import TourBanner from "~/modules/Pages/MainPage/TourBanner.vue";

const { isMobile } = useDevice();
const { loadSearchData } = useSearch();
const isLoading = ref(true);
const isIntersecting = ref(false);

const HousingTypes = defineAsyncComponent(() => import('@/modules/Pages/MainPage/HousingTypes.vue'))


const componentContainer = ref(null)
const showComponent = ref(false)

onMounted(() => {
	const observer = new IntersectionObserver((entries) => {
		if (entries[0].isIntersecting) {
			setTimeout(() => {
				showComponent.value = true
			}, 500)
			observer.disconnect()
		}
	})
	
	if (componentContainer.value) {
		observer.observe(componentContainer.value)
	}
})

useSeoMeta({
	title: 'Отдых в Абхазии 2025, цены на жилье у моря, отзывы. Снять жилье в Абхазии недорого.',
	ogTitle: 'Отдых в Абхазии 2025, цены на жилье у моря, отзывы. Снять жилье в Абхазии недорого.',
	description: 'Более 400 недорогих вариантов жилья для отдыха в Абхазии в 2025 году: квартиры, коттеджи, гостевые дома, номера в отелях и гостиницах у самого моря. Удобный выбор по цене, отзывы реальных гостей, экскурсии и трансферы для комфортного отдыха.',
	ogDescription: 'Более 400 недорогих вариантов жилья для отдыха в Абхазии в 2025 году: квартиры, коттеджи, гостевые дома, номера в отелях и гостиницах у самого моря. Удобный выбор по цене, отзывы реальных гостей, экскурсии и трансферы для комфортного отдыха.',
})

</script>

<template>
    <BookingBanner />
	<PromoBanner/>
    <PopularCities />
	<div class="wrapper">
		<TourBanner/>
	</div>
	<div class="wrapper">
		<h2 class="types__title">Лучшие предложения</h2>
		<div ref="componentContainer" style="min-height: 400px">
			<HousingTypes v-if="showComponent"/>
			<HousingTypesLoader v-else/>
		</div>
		
	</div>
	<CallBackForm/>
	<div class="wrapper">
		<PassListingBanner/>
	</div>

    <Advantages />

</template>

<style scoped lang="scss">
.types {
	&__title {
		font-size: 32px;
		margin-top: 42px;
		text-align: center;
	}
	@media screen and (max-width: 650px) {
		&__title {
			font-size: 24px;
			
		}
	}
}
</style>
