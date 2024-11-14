<script setup lang="ts">
import {mdiChevronLeft, mdiHeart, mdiHeartOutline, mdiShareVariant} from "@mdi/js";
import useListing from "~/modules/Listing/composables/useListing";
import useFavorites from "~/components/pages/Favorites/useFavorites";
const {isMobile} = useDevice()
const emits = defineEmits(['onClose'])
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
	<v-toolbar color="#fff" density="comfortable">
		<template #prepend>
			<v-btn :prepend-icon="mdiChevronLeft" @click="emits('onClose')">Назад</v-btn>
		</template>
		<template #append>
			<v-btn v-if="isMobile && !inFavorite" :icon="mdiHeartOutline" @click="addToFavorites(listing.id)"/>
			<v-btn v-if="isMobile && inFavorite" :icon="mdiHeart" @click="removeFromFavorites(listing.id)"/>
			<v-btn variant="text" v-if="!isMobile && !inFavorite" :prepend-icon="mdiHeartOutline">Сохранить</v-btn>
			<v-btn variant="text" v-if="!isMobile && inFavorite" :prepend-icon="mdiHeart">Сохранено</v-btn>
			<v-menu>
				<template v-slot:activator="{ props }">
					<v-btn v-if="isMobile" v-bind="props" :icon="mdiShareVariant"/>
					<v-btn v-else v-bind="props" variant="text" :prepend-icon="mdiShareVariant">Поделиться</v-btn>
				</template>
				<v-list>
					<v-list-item>
						<v-btn @click="copyToClipboard">Скопировать ссылку</v-btn>
					</v-list-item>
				</v-list>
			</v-menu>
		</template>
	</v-toolbar>

</template>

<style scoped lang="scss">

</style>