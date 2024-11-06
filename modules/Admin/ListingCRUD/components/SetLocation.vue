<script setup lang="ts">
	import {
		initYmaps,
		YandexMap, YandexMapControls,
		YandexMapDefaultFeaturesLayer,
		YandexMapDefaultSchemeLayer, YandexMapMarker,
		YandexMapZoomControl,
	} from "vue-yandex-maps";
	import {ymaps3Import} from "@yandex/ymaps3-types/import"
	import type {Feature, YMap} from "@yandex/ymaps3-types";
	import debounce from "lodash.debounce";
	import useCreateOrUpdateListing from "~/modules/Admin/ListingCRUD/composables/useCreateListing";
	import BtnPrimary from "~/modules/Common/UI/BtnPrimary.vue";
	import {mdiHome} from "@mdi/js";
	
	const {setAddress, listingFormData} = useCreateOrUpdateListing()
	
	const selectedAddress = ref<Feature>();
	const addresses = ref<Feature[] | []>([]);
	const searchQuery = ref('');
	const map = shallowRef<null | YMap>(null);
	
	if (listingFormData.value.coords.longitude && listingFormData.value.coords.width && listingFormData.value.address !== '') {
		selectedAddress.value = {
			properties: {description: "", name: listingFormData.value.address},
			geometry: {
				coordinates: [listingFormData.value.coords.longitude, listingFormData.value.coords.width],
				type: 'Point'
			}
		}
	}
	const addressInput = ref('');
	const cordsInput = ref('')

	const fetchAddresses = async (query: string) => {
		if (query.length === 0) {
			addresses.value = [];
			return;
		}
		await initYmaps();
		addresses.value = await ymaps3.search({text: query});
	};
	const onAddressSelect = (address: Feature) => {
		selectedAddress.value = address
		addresses.value = []
		searchQuery.value = ''
		setAddress(address);
	}
	
	const setCoords = () => {
		const cords = cordsInput.value.split(',').map(i => parseFloat(<string>i))
		const address: Feature  = {
			properties: {description: "", name: addressInput.value},
			geometry: {
				coordinates: [cords[1], cords[0]],
				type: 'Point'
			}
		}
		selectedAddress.value = address;
		setAddress(address);
	}
	
	watch(searchQuery, debounce(() => {
		fetchAddresses(searchQuery.value)
	}, 200));
	const tab = ref(1)

</script>

<template>
	<v-card class="address mt-4" title="Рассположение" text="Введите полный адрес, затем выберите его в выпадающем меню. Если объект не имеет адреса/номера дома, то введите приблизительный и укажите   координаты.">
		
		<v-card-item>
			<v-tabs v-model="tab" color="#7059FF">
				<v-tab :value="1">По улице</v-tab>
				<v-tab :value="2">По координатам</v-tab>
			</v-tabs>
			<v-window v-model="tab">
				<v-window-item :value="1">
					<v-text-field clearable variant="outlined" class="mt-8" v-model="searchQuery" label="Полный адрес"/>
					<v-scroll-y-transition>
						<v-card v-if="addresses.length > 0">
							<v-list>
								<v-list-item
									v-for="address of addresses"
									:title="address.properties.name"
									:subtitle="address.properties.description"
									@click="onAddressSelect(address)"
								/>
							</v-list>
						</v-card>
					</v-scroll-y-transition>
					
				</v-window-item>
				<v-window-item :value="2">
					<form @submit.prevent="setCoords">
						<v-text-field  required variant="outlined" class="mt-4" v-model="addressInput" label="Полный адрес"/>
						<v-text-field required variant="outlined" v-model="cordsInput" label="Координаты из яндекса"/>
						<BtnPrimary class="mb-4" type="submit">Сохранить</BtnPrimary>
					</form>
				</v-window-item>
				<div class="map listingFormData-block" v-if="selectedAddress">
					<h2 class="mb-2">Жилье на карте</h2>
					<p> <strong>Город, регион:</strong> {{ selectedAddress.properties.description }}</p>
					<p class="mb-4"> <strong>Улица дом:</strong> {{ selectedAddress.properties.name }}</p>
					
					<yandex-map
						v-model="map"
						class="map__canvas"
						:settings="{
				        location: {
				          center: selectedAddress.geometry?.coordinates,
				          zoom: 17,
				        },
		             }"
						width="100%"
					>
						<yandex-map-default-scheme-layer/>
						<yandex-map-default-features-layer/>
						<yandex-map-controls :settings="{ position: 'right' }">
							<yandex-map-zoom-control/>
						</yandex-map-controls>
						<yandex-map-marker
							position="top left-center"
							v-if="selectedAddress.geometry"
							:settings="{
                            coordinates: selectedAddress.geometry?.coordinates,
                        }"
						>
							<div class="marker">
								<v-icon color="#fff" size="x-large" :icon="mdiHome"></v-icon>
							</div>
						</yandex-map-marker>
					
					</yandex-map>
				</div>
			</v-window>
			
			
		</v-card-item>
		
		
	</v-card>

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

