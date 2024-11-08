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
</script>

<template>
	<v-toolbar color="#fff" density="comfortable">
		<template #prepend>
			<v-btn :prepend-icon="mdiChevronLeft" @click="emits('onClose')">Назад</v-btn>
		</template>
		<template #append>
			<v-btn v-if="isMobile && !inFavorite" :icon="mdiHeartOutline"/>
			<v-btn v-if="isMobile && inFavorite" :icon="mdiHeart"/>
			<v-btn variant="text" v-if="!inFavorite" :prepend-icon="mdiHeartOutline">Сохранить</v-btn>
			<v-btn variant="text" v-else :prepend-icon="mdiHeart">Сохранено</v-btn>
			<v-menu>
				<template v-slot:activator="{ props }">
					<v-btn v-if="isMobile" :icon="mdiShareVariant"/>
					<v-btn v-else v-bind="props" variant="text" :prepend-icon="mdiShareVariant">Поделиться</v-btn>
				</template>
				<v-list>
					<v-list-item>
						<v-btn>Скопировать ссылку</v-btn>
					</v-list-item>
				</v-list>
			</v-menu>
		</template>
	</v-toolbar>

</template>

<style scoped lang="scss">

</style>