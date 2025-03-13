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
const loaded = ref(false);

const HousingTypes = defineAsyncComponent({
	loader: () => import('@/modules/Pages/MainPage/HousingTypes.vue'),
	loadingComponent: HousingTypesLoader,
	delay: 200,
	timeout: 10000,
	hydrate: hydrateOnVisible()
});

let housingTypes = ref(null);

onMounted(async () => {
	housingTypes.value = await $fetch('/api/listings/all-types', {
		transform: housingTypes => housingTypes.filter(type => type.totalCount > 0)
	});
	loaded.value = true;
})

useSeoMeta({
	title: 'Жилье в Абхазии посуточно 2025: бронирование с трансфером и экскурсиями',
	ogTitle: 'Жилье в Абхазии посуточно 2025: бронирование с трансфером и экскурсиями',
	description: 'Аура Тур — сервис бронирования жилья в Абхазии с полным сопровождением. Квартиры посуточно, гостевые дома, отели и коттеджи у моря. Организуем трансферы из Адлера/Сочи, персональные экскурсии, авторские туры. Лучшие цены от 1 000₽/сутки — гарантия качества и поддержка 24/7!',
	ogDescription: 'Аура Тур — сервис бронирования жилья в Абхазии с полным сопровождением. Квартиры посуточно, гостевые дома, отели и коттеджи у моря. Организуем трансферы из Адлера/Сочи, персональные экскурсии, авторские туры. Лучшие цены от 1 000₽/сутки — гарантия качества и поддержка 24/7!',
	ogImage: 'https://aura-tour-abkhazia.ru/seo/gagra.webp',
	ogImageSecureUrl: 'https://aura-tour-abkhazia.ru/seo/gagra.webp',
	ogImageAlt: 'Жилье в Абхазии посуточно 2025: бронирование с трансфером и экскурсиями',
	ogUrl: 'https://aura-tour-abkhazia.ru',
	ogType: 'website'
})

useHead({
	script: [
		{
			type: 'application/ld+json',
			children: JSON.stringify({
				"@context": "https://schema.org",
				"@type": "WebSite",
				"name": "Аура Тур Абхазия",
				"url": "https://aura-tour-abkhazia.ru",
				"potentialAction": {
					"@type": "SearchAction",
					"target": "https://aura-tour-abkhazia.ru/search?q={search_term_string}",
					"query-input": "required name=search_term_string"
				}
			})
		},
		{
			type: 'application/ld+json',
			children: JSON.stringify({
				"@context": "https://schema.org",
				"@type": "WebPage",
				"name": "Жилье в Абхазии посуточно 2025: бронирование с трансфером и экскурсиями",
				"description": "Аура Тур — сервис бронирования жилья в Абхазии с полным сопровождением. Квартиры посуточно, гостевые дома, отели и коттеджи у моря. Организуем трансферы из Адлера/Сочи, персональные экскурсии, авторские туры. Лучшие цены от 1 000₽/сутки — гарантия качества и поддержка 24/7!",
				"url": "https://aura-tour-abkhazia.ru",
				"isPartOf": {
					"@type": "WebSite",
					"name": "Аура Тур Абхазия",
					"url": "https://aura-tour-abkhazia.ru"
				},
				"breadcrumb": {
					"@type": "BreadcrumbList",
					"itemListElement": [
						{
							"@type": "ListItem",
							"position": 1,
							"name": "Главная",
							"item": "https://aura-tour-abkhazia.ru"
						}
					]
				},
				"about": {
					"@type": "LodgingBusiness",
					"name": "Жилье в Абхазии посуточно 2025: бронирование с трансфером и экскурсиями",
					"description": "Аура Тур — сервис бронирования жилья в Абхазии с полным сопровождением. Квартиры посуточно, гостевые дома, отели и коттеджи у моря. Организуем трансферы из Адлера/Сочи, персональные экскурсии, авторские туры. Лучшие цены от 1 000₽/сутки — гарантия качества и поддержка 24/7!",
					"image": "https://aura-tour-abkhazia.ru/images/logo.png",
					"address": {
						"@type": "PostalAddress",
						"addressCountry": "Российская Федерация",
						"addressRegion": "Абхазия",
						"addressLocality": "Гудаута",
						"postalCode": "384850",
						"streetAddress": "г. Гудаута, Очамчирская 90"
					},
					"telephone": "+7 (940) 997-67-02",
					"email": "lana.2015lana@mail.ru",
					"url": "https://aura-tour-abkhazia.ru",
					"priceRange": "от 1 000₽/сутки",
					"openingHoursSpecification": {
						"@type": "OpeningHoursSpecification",
						"dayOfWeek": [
							"Monday",
							"Tuesday",
							"Wednesday",
							"Thursday",
							"Friday",
							"Saturday",
							"Sunday"
						],
						"opens": "00:00",
						"closes": "23:59"
					}
				}
			})
		},
		{
			type: 'application/ld+json',
			children: JSON.stringify({
				"@context": "https://schema.org",
				"@type": "Organization",
				"name": "Аура Тур",
				"legalName": "Аура Тур Абхазия",
				"url": "https://aura-tour-abkhazia.ru",
				"logo": "https://aura-tour-abkhazia.ru/android-chrome-256x256.png",
				"foundingDate": "2022",
				"address": {
					"@type": "PostalAddress",
					"addressCountry": "Россия",
					"addressRegion": "Абхазия",
					"postalCode": "384850",
					"streetAddress": "г. Гудаута, Очамчирская 90"
				},
				"contactPoint": {
					"@type": "ContactPoint",
					"telephone": "+7 (940) 997-67-02",
					"contactType": "customer service",
					"email": "lana.2015lana@mail.ru",
					"availableLanguage": ["Russian"]
				},
				"sameAs": [
					"https://www.instagram.com/aura_tur_abkhazia?igsh=ejVkeXV2dDV2YzB0",
					"https://t.me/laura_tour"
				]
			})
		}
	]
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
		<HousingTypes :housing-types="housingTypes" v-if="loaded"/>
		<HousingTypesLoader v-else/>
		
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
