<script setup lang="ts">
	import useListing from "~/modules/Listing/composables/useListing";
	import ListingsSlider from "~/modules/Listing/components/shared/ListingsSlider.vue";
	import type {IListingPreviewResponse} from "~/modules/Listing/types/response.types";
	
	const {listing} = useListing()
	const {data, pending} = useLazyAsyncData<{listings: IListingPreviewResponse[], totalCount: number}>('similar-listings', () => $fetch('/api/listings/similar', {
		method: 'POST',
		body: {
			typeId: listing.value.typeId,
			listingId: listing.value.id
		}
	}))
	
	async function goToCategory() {
		await navigateTo({
			path: '/search',
			query: {
				housingTypesId: [listing.value.typeId]
			}
		})
	}

</script>

<template>
	<div class="similar" v-if="!pending && data">
		<h2 class="similar__title">Похожие объекты</h2>
	
		<ListingsSlider :listings="data.listings">
			<template #action>
				<v-btn @click="goToCategory" class="types__btn" color="#7059FF" elevation="0">Смотреть {{numberToVariantsString(data.totalCount)}}</v-btn>
			</template>
		</ListingsSlider>
		
		
	</div>

</template>

<style scoped lang="scss">
.similar {
	&__title {
		font-size: 24px;
		margin-bottom: 16px;
	}
}

</style>