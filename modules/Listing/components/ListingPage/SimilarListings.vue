<script setup lang="tsx">
	import useListing from "~/modules/Listing/composables/useListing";
	import type {IListingPreviewResponse} from "~/modules/Listing/types/response.types";
	import {hydrateOnVisible} from "vue";
	
	const ListingsSlider = defineAsyncComponent({
		loader: () => import("~/modules/Listing/components/shared/ListingsSlider.vue"),
		loadingComponent: {
			setup() {
				return () => (
					<div class="map-loading">
						<VProgressCircular
							indeterminate
							size="64"
							color="primary"
						/>
					</div>
				)
			}
		},
		delay: 200,
		timeout: 10000,
		hydrate: hydrateOnVisible()
	})
	
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
		<Suspense>
			<template #default>
				<ListingsSlider :listings="data.listings">
					<template #action>
						<v-btn @click="goToCategory" class="types__btn" color="#7059FF" elevation="0">Смотреть {{numberToVariantsString(data.totalCount)}}</v-btn>
					</template>
				</ListingsSlider>
			</template>
			<template #fallback>
				<div class="map-loading">
					<v-progress-circular
						indeterminate
						size="64"
						color="primary"
					/>
				</div>
			</template>
		</Suspense>
	</div>

</template>

<style scoped lang="scss">
.similar {
	&__title {
		font-size: 24px;
		margin-bottom: 16px;
	}
}

.map-loading {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 500px;
	
	@media screen and (max-width: 600px) {
		height: 350px;
	}
}

</style>

