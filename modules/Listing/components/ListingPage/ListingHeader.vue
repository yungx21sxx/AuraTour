<script setup lang="ts">

	import useFavorites from "~/components/pages/Favorites/useFavorites";
	import useListing from "~/modules/Listing/composables/useListing";
	import useListingBooking from "~/modules/Listing/composables/useListingBooking";
	import {mdiHeartOutline, mdiHeart, mdiMapMarkerOutline, mdiWaves, mdiShareVariant} from "@mdi/js"
	import ListingAncors from "~/modules/Listing/components/ListingPage/ListingAncors.vue";
	import AncorsMenu from "~/modules/Listing/components/ListingPage/Menu/AncorsMenu.vue";
	
	const {listing} = useListing();
	const {dateModal} = useListingBooking();
	const {addToFavorites, removeFromFavorites, favoriteListingIDs} = useFavorites()
	const inFavorite = computed(() => {
		return favoriteListingIDs.value.includes(listing.value.id)
	})
	
	const {isMobile} = useDevice();
	
	const breadcrumbs = computed(() => {
		const datesQuery = dateModal.value.from && dateModal.value.to ? `&checkIn=${dateModal.value.from.toDateString()}&checkOut=${dateModal.value.to.toDateString()}` : ''
		return [
			{
				title: 'Поиск',
				disabled: false,
				href: `/search?${datesQuery}`,
			},
			{
				title: listing.value.city.name,
				disabled: false,
				href: `/search/city/${listing.value.city.slug}`,
			},
		]
	});
	

</script>

<template>
	<div class="header listing-block">
		<div class="header__top mb-2">
			<v-breadcrumbs :items="breadcrumbs"  style="margin-left: -2px;"></v-breadcrumbs>
			<span v-if="!isMobile">Объект №{{listing.id}}</span>
		</div>
		
		<h1 class="header__title mb-4">{{listing.title}}</h1>
		<div class="header__location">
			<div class="header__location-item">
				<v-icon :icon="mdiMapMarkerOutline" size="20px"/>
				<span>{{listing.city.name}}, {{listing.address}}</span>
			</div>
			<div class="header__location-item">
				<v-icon :icon="mdiWaves" size="20px"/>
				<span>{{listing.seaDistance}}м до моря</span>
			</div>
		</div>
		<AncorsMenu class="header__nav mt-2"/>
	</div>

</template>

<style scoped lang="scss">

.header {
	color: $text-main;
	&__title {
		font-size: 32px;
	}
	
	&__nav {
		margin-bottom: -20px;
	}
	

	
	&__location {
		display: flex;
		gap: 16px;
		
		&-item {
			display: flex;
			gap: 8px;
			align-items: center;
			color: #6A6D81;
		}
	}
	
	&__top {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	
	&__city {
		margin-top: 8px;
		margin-bottom: 16px;
	}
	@media screen and (max-width: 630px) {
		padding-top: 8px !important;
		padding-bottom: 24px !important;
		&__title {
			margin-top: 16px;
			font-size: 20px;
		}
		
		&__location {
			flex-direction: column;
		}
	}
}

</style>