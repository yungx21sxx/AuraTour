<script setup lang="ts">

	import useFavorites from "~/components/pages/Favorites/useFavorites";
	import useListing from "~/modules/Listing/composables/useListing";
	import useListingBooking from "~/modules/Listing/composables/useListingBooking";
	
	const {listing} = useListing();
	const {dateModal} = useListingBooking();
	const {addToFavorites, removeFromFavorites, favoriteListingIDs} = useFavorites()
	const inFavorite = computed(() => {
		return favoriteListingIDs.value.includes(listing.value.id)
	})

	const breadcrumbs = computed(() => {
		const datesQuery = dateModal.value.from && dateModal.value.to ? `&checkIn=${dateModal.value.from.toDateString()}&checkOut=${dateModal.value.to.toDateString()}` : ''
		return [
			{
				title: 'Поиск',
				disabled: false,
				href: `/search?${datesQuery}`,
			},
			{
				title: listing.value.city,
				disabled: false,
				href: `/search?region=${listing.value.region}&regionId=${listing.value.regionId}&city=${listing.value.city}&cityId=${listing.value.cityId}${datesQuery}`,
			},
		]
	});

</script>

<template>
	<div class="header listing-block">
		<div class="header__top mb-2">
			<v-breadcrumbs :items="breadcrumbs"  style="margin-left: -2px;"></v-breadcrumbs>
			<v-chip class="carousel__btn"
			       prepend-icon="mdi-heart-outline"
			 
			        variant="text"
			     
			       v-if="!inFavorite"
			       @click="addToFavorites(listing.id)"
			>Сохранить</v-chip>
			<v-chip class="carousel__btn"
			       prepend-icon="mdi-heart"
			       variant="text"
			       color="#7059FF"
			 
			       v-else
			       @click="removeFromFavorites(listing.id)"
			>Сохранено</v-chip>
		</div>
		
		<h1 class="header__title">{{listing.title}}</h1>
		<p class="header__city">{{listing.city}}, {{listing.address}}</p>
		<div class="header__info listing-chips">
			<v-chip prepend-icon="mdi-waves">{{listing.seaDistance}} м до моря</v-chip>
			<v-chip prepend-icon="mdi-map-marker-outline" color="primary" href="#map">Показать на карте</v-chip>
		</div>
	</div>

</template>

<style scoped lang="scss">

.header {

	&__title {
		font-size: 24px;
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
			font-size: 18px;
		}
	}
}

</style>