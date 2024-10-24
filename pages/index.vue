<script setup lang="ts">


import BookingBanner from "~/modules/Pages/MainPage/BookingBanner.vue";
import PopularCities from "~/modules/Pages/MainPage/PopularCities.vue";
import HousingTypes from "~/modules/Pages/MainPage/HousingTypes.vue";
import Excursions from "~/modules/Pages/MainPage/Excursions.vue";
import Advantages from "~/modules/Pages/MainPage/Advantages.vue";
import useSearch from "~/modules/Booking/composables/useSearch";

const { isMobile } = useDevice();
const { loadSearchData } = useSearch();

await loadSearchData();
</script>

<template>
    <BookingBanner />
    <PopularCities />
    <HousingTypes />
    <Excursions />
	
    <Advantages />
</template>

<style scoped lang="scss"></style>
