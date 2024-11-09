<script setup lang="ts">

import ListingItemCatalog from "~/modules/Listing/components/shared/ListingItemCatalog.vue";

definePageMeta({
	layout: 'admin',
	middleware: ['admin-only'],
})

const {data: listings} = await useFetch('/api/listings/moderation')

</script>

<template>
	<div class="wrapper">
		<h2 class="mb-4">Объекты на модерации</h2>
		<v-alert class="mb-4" type="info" v-if="listings.length === 0">Пока нет объектов</v-alert>
		<ListingItemCatalog
			v-for="listing of listings"
			:listing="listing"
			:key="listing.id"
			target="lk"
		/>
	</div>

</template>

<style scoped lang="scss">

</style>