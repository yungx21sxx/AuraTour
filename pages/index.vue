<script setup lang="ts">
import PromoCardsMobile from "~/components/pages/Index/PromoCardsMobile.vue";
import BookingBanner from "~/components/pages/Index/BookingBanner.vue";
import PromoCardsDesktop from "~/components/pages/Index/PromoCardsDesktop.vue";
import PopularCities from "~/components/pages/Index/PopularCities.vue";
import Advantages from "~/components/pages/Index/Advantages.vue";
import Excursions from "~/components/pages/Index/Excursions.vue";
import useSearch from "~/components/Booking/useSearch";
import LazyHousingTypes from "~/components/pages/Index/HousingTypes.vue";
import AboutBanner from "~/components/pages/Index/AboutBanner.vue";


const {isMobile } = useDevice()
const {loadSearchData} = useSearch()

await loadSearchData();


</script>

<template>
	<BookingBanner/>
	<AboutBanner/>
	<PopularCities/>
	<LazyHousingTypes/>
	<Excursions/>

	<Advantages/>
	
</template>

<style scoped lang="scss">

</style>