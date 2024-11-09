<script setup lang="ts">
	import useFavorites from "~/components/pages/Favorites/useFavorites";
	import type {IListingPreviewResponse} from "~/types/response.types";
	import ListingItemCatalog from "~/modules/Listing/components/shared/ListingItemCatalog.vue";
	import {mdiHeartPlusOutline} from "@mdi/js";
	import MenuMain from "~/modules/Menu/components/MenuMain.vue";
	
	const {getLocaleStoreData} = useFavorites();
	
	const listings = ref<IListingPreviewResponse[]>([]);
	const showEmptyMassage = ref(false);
	const clientLoaded = ref(false);
	const listingsLoaded = ref(false);
	
	onMounted(async () => {
		clientLoaded.value = true;
		const favoriteListingIDs = getLocaleStoreData();
		if (!favoriteListingIDs || favoriteListingIDs.length === 0) {
			showEmptyMassage.value = true
			return;
		}
		
		const data = await $fetch('/api/listings/favorites', {
			method: 'POST',
			body: {
				listingIDs: favoriteListingIDs
			}
		})
		
		if (data) {
			listings.value = data;
			listingsLoaded.value = true
		} else {
			showEmptyMassage.value = true;
		}
		
	})
	
	const breadcrumbs = [
		{
			title: 'Главная',
			disabled: false,
			href: `/`,
		},
		{
			title: 'Избранное',
			disabled: true,
			href: ``,
		},
	]

</script>

<template>
	<MenuMain/>
	<div class="favorites">
		<v-breadcrumbs class="mb-2" :items="breadcrumbs"></v-breadcrumbs>
		<h1 class="mb-4">Избранное жилье</h1>
		<div class="favorites__body" v-if="clientLoaded">
			<v-alert
				:icon="mdiHeartPlusOutline"
				class="mt-4"
				color="#FFFFFF"
				v-if="showEmptyMassage"
			>
				<template #text>
					<div class="alert">
						<h3 class="alert__title mb-2">У вас пока нет избранного жилья</h3>
						<p class="mb-4">Здесь будет храниться ваш список избранного жилья</p>
						<v-btn href="/search" color="#7059FF">Найти жилье</v-btn>
					</div>
				</template>
			</v-alert>
			<ListingItemCatalog
				v-for="listing of listings"
				:listing="listing"
			/>
		</div>
		
		
	</div>

	
</template>

<style scoped lang="scss">
	.favorites {
		padding: 16px;
		max-width: 900px;
		width: 100%;
		margin-left: auto;
		margin-right: auto;
		margin-top: 16px;
	}

</style>