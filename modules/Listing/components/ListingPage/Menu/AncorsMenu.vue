<script setup lang="ts">

import {mdiHeart, mdiHeartOutline, mdiShareVariant} from "@mdi/js";
import ListingAncors from "~/modules/Listing/components/ListingPage/ListingAncors.vue";
import useFavorites from "~/components/pages/Favorites/useFavorites";
import useListing from "~/modules/Listing/composables/useListing";

const {isMobile} = useDevice()
const {listing} = useListing();
const {addToFavorites, removeFromFavorites, favoriteListingIDs} = useFavorites()
const inFavorite = computed(() => {
	return favoriteListingIDs.value.includes(listing.value.id)
})

async function copyToClipboard() {
	try {
		await navigator.clipboard.writeText(window.location.href);
		alert('Ссылка скопирована в буфер обмена');
	} catch (err) {
		console.error('Ошибка при копировании: ', err);
	}
}
</script>

<template>
	<div class="nav">
		<ListingAncors/>
		<div class="nav__actions" v-if="!isMobile">
			<v-btn variant="text" v-if="!inFavorite" :prepend-icon="mdiHeartOutline" @click="addToFavorites(listing.id)">Сохранить</v-btn>
			<v-btn variant="text" v-else :prepend-icon="mdiHeart" @click="removeFromFavorites(listing.id)">Сохранено</v-btn>
			<v-menu>
				<template v-slot:activator="{ props }">
					<v-btn v-bind="props" variant="text" :prepend-icon="mdiShareVariant">Поделиться</v-btn>
				</template>
				<v-list>
					<v-list-item>
						<v-btn @click="copyToClipboard">Скопировать ссылку</v-btn>
					</v-list-item>
				</v-list>
			</v-menu>
		</div>
	</div>
</template>

<style scoped lang="scss">

.nav {
	display: flex;
	justify-content: space-between;
	&__actions {
		display: flex;
		align-items: center;
	}
}

</style>