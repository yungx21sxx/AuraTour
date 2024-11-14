<script setup lang="ts">
	import useMapCatalog from "~/modules/Search/composables/useMapCatalog";
	import type { YMap } from '@yandex/ymaps3-types';
	import {
		YandexMap,
		YandexMapControls, YandexMapDefaultFeaturesLayer,
		YandexMapDefaultSchemeLayer,
		YandexMapMarker,
		YandexMapZoomControl,
		VueYandexMaps,
	} from 'vue-yandex-maps';
	import BtnSecondary from "~/modules/Common/UI/BtnSecondary.vue";
	import {mdiChevronLeft, mdiClose} from "@mdi/js";
	import type {ListingMapItemResponse} from "~/modules/Search/types/response.types";
	import type {IListingPreviewResponse} from "~/types/response.types";
	import useCatalog from "~/modules/Search/composables/useCatalog";
	import ListingItemCatalog from "~/modules/Listing/components/shared/ListingItemCatalog.vue";
	
	const {bookingDTO} = useCatalog()
	
	export interface ListingMapPoint {
		id: number[],
		coords: {
			longitude: number
			width: number
		},
		address: string,
		priceStr: string
	}
	
	const {target = 'catalog'} = defineProps<{
		target?: 'modal' | 'catalog'
	}>()
	const map = shallowRef<null | YMap>(null);
	
	const {
		fetchMapListingsList,
		mapCatalogIsOpen
	} = useMapCatalog();
	
	const { data: mapListingsList, error: initialError } = await useAsyncData('map-listings-list', () => fetchMapListingsList());
	
	function groupListingsByAddress(items: ListingMapItemResponse[]): ListingMapPoint[] {
		const map = new Map<string, ListingMapPoint>();
		
		items.forEach(item => {
			const existingEntry = map.get(item.address);
			
			if (existingEntry) {
				// Если адрес уже есть, добавляем id в массив и обновляем минимальную цену
				existingEntry.id.push(item.id);
				
				// Определяем минимальную цену среди всех totalPrice (если не null) и minPrice
				const currentMinPrice = Math.min(
					...existingEntry.id.map(id => {
						const listing = items.find(i => i.id === id);
						return listing?.totalPrice !== null ? listing.totalPrice : listing?.minPrice;
					})
				);
				
				// Обновляем строку с ценой с префиксом "от"
				existingEntry.priceStr = `от ${currentMinPrice.toLocaleString()} ₽`;
			} else {
				// Если это первый объект с данным адресом, добавляем его в Map
				map.set(item.address, {
					id: [item.id],
					coords: item.coords,
					address: item.address,
					priceStr: item.totalPrice !== null
						? `${item.totalPrice.toLocaleString()} ₽`
						: `от ${item.minPrice.toLocaleString()} ₽`
				});
			}
		});
		
		return Array.from(map.values());
	}
	
	const groupedListings = ref<ListingMapPoint[]>(groupListingsByAddress(mapListingsList.value.listings));
	
	
	watch(mapListingsList, () => {
		groupedListings.value = groupListingsByAddress(mapListingsList.value.listings)
	}, {deep: true});
	
	const listingModal = ref(false);
	const currentListings = ref<IListingPreviewResponse[] | null>(null);
	const listingsLoading = ref(false);
	
	const openListingModal = async (IDs: number[]) => {
		listingModal.value = true;
		listingsLoading.value = true;
		currentListings.value = await $fetch(`/api/listings/listings-from-point`, {
			method: 'POST',
			body: {
				IDs,
				booking: bookingDTO.value
			}
		})
		listingsLoading.value = false
	}
	
	const {isMobile} = useDevice();
	
	const mapLoading = ref(true);
	const mapError = ref(false);
	
	// onBeforeUnmount(() => {
	// 	console.log('destroy map')
	// 	map.value?.destroy()
	// 	map.value = null;
	// 	mapKey.value = Date.now();
	// 	mapLoading.value = false;
	// })
	
	const mapKey = ref(Date.now());
	
	
	watch(map, () => {
		mapLoading.value = false
	})
	
	onMounted(() => {
		// mapLoading.value = false
	})
	
	watch(VueYandexMaps.loadStatus, (status) => {
		if (status === 'loaded') {
			mapLoading.value = false;
		}
		if (VueYandexMaps.loadError.value) {
			mapError.value = true
			mapLoading.value = false
		}
	});
</script>

<template>
	
		<div :class="[{
				'map-catalog': target === 'catalog',
				'map-modal': target === 'modal'
			}]"
		>
			<div class="header">
				<h3 id="listings">Найдено {{ mapListingsList.count }} вариантов жилья</h3>
				<BtnSecondary class="btn" :prepend-icon="mdiChevronLeft" @click="mapCatalogIsOpen = false">Назад к каталогу</BtnSecondary>
			</div>
			<div
				id="map"
				:class="['map', {
					'map_modal': target === 'modal'
				}]"
				:style="{
						display: mapLoading ? 'none' : 'block'
				}"
			>
				<yandex-map
					v-model="map"
					id="map__canvas"
					class="map__canvas"
					:settings="{
			        location: {
			          center: [mapListingsList.listings[0].coords.longitude, mapListingsList.listings[0].coords.width],
			          zoom: 14,
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
						v-for="listing of groupedListings"
						@click="openListingModal(listing.id)"
						position="top left-center"
						:settings="{
                    coordinates: [listing.coords.longitude, listing.coords.width],
                }"
					>
						<div class="marker">
							<span class="marker__price">{{listing.priceStr}}</span>
							<span class="marker__count" v-if="listing.id.length > 1">{{listing.id.length}}</span>
						</div>
					</yandex-map-marker>
				</yandex-map>
				
			</div>
			<div v-if="mapLoading && !mapError" style="display: flex; justify-content: center; height: 400px; flex-direction: column; align-items: center">
				<v-progress-circular
					color="primary"
					indeterminate
				></v-progress-circular>
			</div>
			<div v-if="mapError" style="display: flex; justify-content: center; height: 400px; flex-direction: column; align-items: center">
				<v-alert type="error" title="Ошибка загрузки карты!" text="Попробуйте отключить VPN."/>
			</div>
			
			<v-dialog v-model="listingModal" max-width="800px" v-if="target === 'catalog'" scrollable>
				<v-card>
					<v-toolbar color="white">
						<v-btn :prepend-icon="mdiChevronLeft" @click="listingModal = false">Назад</v-btn>
					</v-toolbar>
					<v-card-item>
						<ListingItemCatalog
							v-for="listing of currentListings"
							:listing="listing"
							v-if="!listingsLoading"
						/>
						<div v-else style="display: flex; justify-content: center; margin-top: 24px; margin-bottom: 56px;">
							<v-progress-circular
								color="primary"
								indeterminate
							></v-progress-circular>
						</div>
					</v-card-item>
				</v-card>
			</v-dialog>
			
			<v-dialog v-model="listingModal" max-width="800px" v-else scrollable>
				<v-card style="border-radius: 16px">
					<v-toolbar color="white">
						<v-btn :prepend-icon="mdiChevronLeft" @click="listingModal = false">Назад</v-btn>
					</v-toolbar>
					<v-card-text style="padding: 0">
						<ListingItemCatalog
							v-for="listing of currentListings"
							:listing="listing"
							v-if="!listingsLoading"
						/>
						<div v-else style="display: flex; justify-content: center; margin-top: 24px; margin-bottom: 56px;">
							<v-progress-circular
								color="primary"
								indeterminate
							></v-progress-circular>
						</div>
					</v-card-text>
				
				</v-card>
			</v-dialog>
		</div>
</template>

<style scoped lang="scss">



.header {
	display: flex;
	justify-content: space-between;
	margin-bottom: 16px;
	width: 100%;
	align-items: center;
	
	@media screen and (max-width: 600px) {
		display: block !important;
		margin-bottom: 0 !important;
		
		h3 {
			font-weight: 600;
			font-size: 16px;
		}
	}
}

.marker {
	top: 50%;
	left: 100%;
	right: 100%;
	border-radius: 12px;
	padding: 4px 8px;
	background: $accent-blue;
	border: 1px solid #fff;
	box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
	display: flex;
	gap: 8px;
	align-items: center;
	font-size: 14px;
	white-space: nowrap;
	color: #fff;
	
	&__count {
		border-left: 1px solid white;
		padding-left: 8px;
	}
}

.map {
	&__canvas {
		height: 600px !important;
	}
}

.map-modal {
	.header {
		display: none !important;
	}
	.map__canvas {
		height: 100svh !important;
		width: 100%;
	}
}

</style>