<script setup lang="ts">
	import useCatalog from "~/modules/Search/composables/useCatalog";
	import MenuMain from "~/modules/Menu/components/MenuMain.vue";
	import FilterFormBookingInfo from "~/modules/Search/components/filters/FilterFormBookingInfo.vue";
	import useSearch from "~/modules/Booking/composables/useSearch";
	import useFilters from "~/modules/Search/composables/useFilters";
	
	const {seoPage} = useCatalog();
	const {chosenFilters, filtersInitData} = useFilters();
	const breadcrumbs = computed(() => {
		const crumbs = [
			{
				title: 'Главная',
				disabled: false,
				href: '/',
			},
		];
		
		// Если есть город, добавляем крошку для города
		if (seoPage.value?.city) {
			crumbs.push({
				title: seoPage.value.city.name,
				disabled: false,
				href: `/search/city/${seoPage.value.city.slug}`,
			});
		}
		
		// Если есть тип жилья, добавляем крошку для него
		if (seoPage.value && seoPage.value.ListingType) {
			// Если есть и город, и тип жилья, добавляем крошку с обоими параметрами
			if (seoPage.value.city) {
				crumbs.push({
					title: seoPage.value.ListingType.name,
					disabled: true,
					href: `/search/city/${seoPage.value.city.slug}/${seoPage.value.ListingType.value}`,
				});
			} else {
				// Если есть только тип жилья, добавляем крошку без города
				crumbs.push({
					title: seoPage.value.ListingType.name,
					disabled: true,
					href: `/search/type/${seoPage.value.ListingType.value}`,
				});
			}
		}
		
		return crumbs;
	});
	if (seoPage.value) {
		useSeoMeta({
			title: seoPage.value.title,
			description: seoPage.value.description,
			ogTitle: seoPage.value.title,
			ogDescription: seoPage.value.description,
			ogImage: 'https://aura-tour-abkhazia.ru' + seoPage.value.photoUrl,
		})
		const schemaOrg = computed(() => ({
			"@context": "https://schema.org",
			"@type": "WebPage",
			"name": seoPage.value.title,
			"description": seoPage.value.description,
			"url": `https://yourwebsite.com${seoPage.value.path}`,
			"image": seoPage.value.photoUrl,
			"lastReviewed": seoPage.value.lastModified,
			"isPartOf": {
				"@type": "WebSite",
				"name": "Аура Тур Абхазия",
				"url": "https://aura-tour-abkhazia.ru/"
			},
			"breadcrumb": {
				"@type": "BreadcrumbList",
				"itemListElement": breadcrumbs.value.map((breadcrumb, index) => ({
					"@type": "ListItem",
					"position": index + 1,
					"name": breadcrumb.title,
					"item": "https://aura-tour-abkhazia.ru" + breadcrumb.href
				}))
			},
			"about": {
				"@type": "LodgingBusiness",
				"name": seoPage.value.title,
				"address": seoPage.value.city
					? {
						"@type": "PostalAddress",
						"addressLocality": seoPage.value.city.name,
						"addressCountry": "Абхазия"
					}
					: undefined
			}
		}))
		useHead({
			script: [
				{
					type: 'application/ld+json',
					children: JSON.stringify(schemaOrg.value)
				}
			]
		})
	}

	

</script>

<template>
	<header
		v-if="seoPage"
		class="header"
		:style="{
			backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.1)), url(${seoPage.photoUrl})`,
	    }"
	>
		<MenuMain variant="light" class="header__menu"/>
		<div class="wrapper">
			<v-breadcrumbs :items="breadcrumbs" class="header__breadcrumbs mb-4"/>
			<h1 class="header__title">{{seoPage.smallTitle}}</h1>
			<FilterFormBookingInfo class="header__form" light/>
			<div class="header__types">
				<v-chip-group
					show-arrow
					multiple
					v-model="chosenFilters.housingTypesId"
				>
					<v-chip
						v-for="type of filtersInitData.housingTypes.filter(type => type.count > 0)"
						variant="elevated"
						:value="type.id"
						style="background: rgba(255,255,255,.9); color: #333D46; "
						:key="type.id"
						:text="type.name"
						filter
					></v-chip>
				</v-chip-group>
			</div>
		</div>
		
	</header>

</template>

<style scoped lang="scss">

	.header {
		display: flex;
		flex-direction: column;
		justify-content: center;
		height: 600px;
		background-position: center center;
		background-repeat: no-repeat;
		background-size: cover;
		
		
		&__types {
			color: white;
			margin-top: 24px;
		}
		
		&__menu {
			position: absolute;
			top: 0;
			width: 100%;
		}
		
		&__breadcrumbs {
			color: #fff;
			margin-bottom: 8px;
		}
		
		&__title {
			font-size: 42px;
			color: #fff;
			margin-bottom: 24px;
		}
		
		@media screen and (max-width: 950px) {
			height: 600px;
			
			&__title {
				font-size: 32px;
			}
		}
		
		@media screen and (max-width: 440px) {
			height: 600px;
			
			&__title {
				font-size: 28px;
			}
		}
		
		
	}


</style>