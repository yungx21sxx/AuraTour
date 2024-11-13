<script setup lang="ts">
	import useCatalog from "~/modules/Search/composables/useCatalog";
	import MenuMain from "~/modules/Menu/components/MenuMain.vue";
	import FilterFormBookingInfo from "~/modules/Search/components/filters/FilterFormBookingInfo.vue";
	
	const {seoPage} = useCatalog();
	
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
		if (seoPage.value?.ListingType) {
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

</script>

<template>
	<header
		v-if="seoPage"
		class="header"
		:style="{
			backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.05)), url(${seoPage.photoUrl})`,
	    }"
	>
		<MenuMain variant="light" class="header__menu"/>
		<div class="wrapper">
			<v-breadcrumbs :items="breadcrumbs" class="header__breadcrumbs"/>
			<h1 class="header__title">{{seoPage.smallTitle}}</h1>
			<FilterFormBookingInfo class="header__form" light/>
		</div>
		
	</header>

</template>

<style scoped lang="scss">

	.header {
		display: flex;
		flex-direction: column;
		justify-content: center;
		height: 400px;
		background-position: center center;
		background-repeat: no-repeat;
		background-size: cover;
		
		&__menu {
			position: absolute;
			top: 10px;
			width: 100%;
		}
		
		&__breadcrumbs {
			color: #fff;
			margin-bottom: 16px;
		}
		
		&__title {
			font-size: 42px;
			color: #fff;
			margin-bottom: 32px;
		}
		
		@media screen and (max-width: 950px) {
			height: 500px;
			
			&__title {
				font-size: 32px;
			}
		}
		
		@media screen and (max-width: 440px) {
			height: 500px;
			
			&__title {
				font-size: 28px;
			}
		}
		
		
	}


</style>