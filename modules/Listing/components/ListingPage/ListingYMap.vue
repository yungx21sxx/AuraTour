<script setup lang="tsx">
import useListing from "~/modules/Listing/composables/useListing";
import {hydrateOnVisible} from "vue";

const { listing } = useListing();

const AsyncMap = defineAsyncComponent({
	loader: () => import('./AsyncMap.vue'),
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
});
</script>

<template>
	<div class="map listing-block">
		<h2 class="mb-2">Жилье на карте</h2>
		<p class="mb-6">{{ listing.city.name }}, {{ listing.address }}</p>
		<Suspense>
			<template #default>
				<AsyncMap :listing="listing" />
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
.map-loading {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 500px;
	
	@media screen and (max-width: 600px) {
		height: 350px;
	}
}

.marker {
	/* сохраните существующие стили маркера */
}

.map__canvas {
	height: 500px !important;
	
	@media screen and (max-width: 600px) {
		height: 350px !important;
	}
}
</style>