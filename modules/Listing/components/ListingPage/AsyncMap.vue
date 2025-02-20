<!-- AsyncMap.vue -->
<script setup lang="ts">
import type { YMap } from '@yandex/ymaps3-types';
import {
	YandexMap,
	YandexMapControls,
	YandexMapDefaultFeaturesLayer,
	YandexMapDefaultSchemeLayer,
	YandexMapMarker,
	YandexMapZoomControl
} from 'vue-yandex-maps';
import { mdiHome } from "@mdi/js";
import type {IListingResponse} from "~/modules/Listing/types/response.types";

defineProps<{
	listing: IListingResponse
}>();

const map = shallowRef<YMap | null>(null);
</script>

<template>
	<yandex-map
		v-model="map"
		class="map__canvas"
		:settings="{
      location: {
        center: [listing.coords.longitude, listing.coords.width],
        zoom: 17,
      },
    }"
		width="100%"
	>
		<yandex-map-default-scheme-layer/>
		<yandex-map-default-features-layer/>
		<yandex-map-controls :settings="{ position: 'right' }">
			<yandex-map-zoom-control />
		</yandex-map-controls>
		<yandex-map-marker
			position="top left-center"
			:settings="{
        coordinates: [listing.coords.longitude, listing.coords.width],
      }"
		>
			<div class="marker">
				<v-icon color="#fff" size="x-large" :icon="mdiHome"></v-icon>
			</div>
		</yandex-map-marker>
	</yandex-map>
</template>

<style scoped lang="scss">
.marker {
	top: 50%;
	left: 100%;
	right: 100%;
	width: 50px;
	height: 50px;
	background: $accent-blue;
	border-radius: 50%;
	border: 2px solid #fff;
	box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
	display: flex;
	justify-content: center;
	align-items: center;
}

.map {
	
	
	&__canvas {
		height: 500px !important;
		
		@media screen and (max-width: 600px ){
			height: 350px !important;
		}
	}
}
</style>