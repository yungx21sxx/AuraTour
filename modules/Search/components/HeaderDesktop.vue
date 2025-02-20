<script setup lang="ts">
import FilterFormBookingInfo from "~/modules/Search/components/filters/FilterFormBookingInfo.vue";
import MenuMain from "~/modules/Menu/components/MenuMain.vue";
import useSearch from "~/modules/Booking/composables/useSearch";

const {searchData} = useSearch();


const route = useRoute();
const citySlug = route.params.citySlug as string || null;
const typeSlug = route.params.typeSlug as string || null;
const cityName = searchData.value.cities.find(city => city.slug === citySlug)?.cityName;

const breadcrumbs = [
	{
		title: 'Главная',
		disabled: false,
		href: '/',
	},
	{
		title: 'Выбрать жилье',
		disabled: true,
		href: '',
	},
];


</script>

<template>
	<header class="header">
		<MenuMain/>
		<div class="wrapper header__body">
			<v-breadcrumbs :items="breadcrumbs" class="header__breadcrumbs"/>
			<h1 class="header__title" v-if="cityName">{{cityName}}: поиск жилья</h1>
			<h1 class="header__title" v-else>Поиск жилья в Абхазии</h1>
			<FilterFormBookingInfo/>
		</div>
		
	</header>
	
</template>

<style scoped lang="scss">
	.header {
		background: $bg-card;
		border-top: 1px solid $bg;
	
		
		&__breadcrumbs {
			margin-bottom: 16px;
		}
		
		&__title {
			font-size: 32px;
			margin-bottom: 16px;
			@media screen and (max-width: 600px){
				font-size: 24px;
			}
		}
		
		&__body {
			margin-top: 24px;
		}
	}

</style>