<script setup lang="ts">
import {mdiCalendarMonthOutline, mdiMagnify, mdiAccountOutline, mdiMinus, mdiPlus, mdiTuneVariant, mdiArrowRightCircleOutline} from "@mdi/js";
import useBooking from "~/modules/Booking/composables/useBooking";
import useCatalog from "~/modules/Search/composables/useCatalog";
import type {IQueryBooking} from "~/modules/Booking/types/query.types";
import type {FiltersDTO} from "~/modules/Search/types/dto.types";
import useFilters from "~/modules/Search/composables/useFilters";
import debounce from "lodash.debounce";
import BookingSearchLocation from "~/modules/Booking/components/BookingSearchLocation.vue";
import BookingSetDate from "~/modules/Booking/components/BookingSetDate.vue";
import useSearch from "~/modules/Booking/composables/useSearch";
import BtnPrimary from "~/modules/Common/UI/BtnPrimary.vue";
import useMapCatalog from "~/modules/Search/composables/useMapCatalog";

const {light} = defineProps({
	light: {
		type: Boolean,
		required: false,
		default: false
	}
})

const {
	peopleCount,
	bookingModals,
	describedGroup,
	openLocationModal,
	openSetDateModal,
	beautifyDate,
	getBookingQueryLinkParameters,
} = useBooking();

const { getRedirectPath, debouncedRefreshListingList , createBookingDTO} = useCatalog();
const { parseQueryParams, filtersModalIsOpen } = useFilters();
const {chosenCity} = useSearch();

const route = useRoute()

const dates = computed(() => {
	const {from, to} = bookingModals.value.date
	return {from, to}
})
const citySlug = computed(() => bookingModals.value.location.slug)

const guestSetMenuIsOpen = ref(false);
const guestSetMenuMobileIsOpen = ref(false);


watch(citySlug, async () => {
	await navigateTo({
		path: getRedirectPath(citySlug.value),
		query: {
			...getBookingQueryLinkParameters.value,
		}
	}, {
		external: true
	})
})


watch(getBookingQueryLinkParameters, async () => {
	const filtersQueryParameters: FiltersDTO = parseQueryParams(route.query);
	await navigateTo({
		path: getRedirectPath(),
		query: {
			...getBookingQueryLinkParameters.value,
			...filtersQueryParameters
		}
	})
	createBookingDTO(getBookingQueryLinkParameters.value, citySlug.value);
	debouncedRefreshListingList();
	const {mapCatalogIsOpen, mapModalIsOpen} = useMapCatalog();
	if (mapCatalogIsOpen.value || mapModalIsOpen.value) {
		await refreshNuxtData('map-listings-list');
	}
}, {
	deep: true,
})

const scrollBottom = () => window.scrollBy(0, 140);

</script>

<template>
	<div :class="['booking', {
		'light': light,
	}]">
		<div class="booking__mobile">
			<div class="search__bar">
				<v-card class="booking__location" :ripple="{ class: 'ripple-color' }"  @click="openLocationModal">
					<v-icon :icon="mdiMagnify"></v-icon>
					<span v-if="!chosenCity">Выберите курорт</span>
					<div v-else>
						<span>{{chosenCity.cityName}}</span>
					</div>
				</v-card>
			</div>
			<div class="search__chips">
				<div style="display: flex; gap: 16px; margin: 24px 0 32px 0;">
					<v-chip :variant="light ? 'outlined' : 'tonal'" :color="light ? '#fff' : ''" size="large" :prepend-icon="mdiCalendarMonthOutline" @click="openSetDateModal" v-if="dates.from && dates.to">
						{{beautifyDate(dates.from)}} - {{beautifyDate(dates.to)}}
					</v-chip>
					<v-chip :variant="light ? 'outlined' : 'tonal'" :color="light ? '#fff' : ''" size="large" :prepend-icon="mdiCalendarMonthOutline" @click="openSetDateModal" v-else>
						Выбрать даты
					</v-chip>
					<v-menu :close-on-content-click="false" v-model="guestSetMenuMobileIsOpen">
						<template v-slot:activator="{ props }">
							<v-chip :variant="light ? 'outlined' : 'tonal'" :color="light ? '#fff' : ''" size="large" :prepend-icon="mdiAccountOutline"  v-bind="props" >
								{{ describedGroup }}
							</v-chip>
						</template>
						<v-card>
							<v-card-item>
								<div class="amount">
									<div class="amount__info">
										<strong class="amount__title">
											Взрослые
										</strong>
										<span class="amount__subtitle">
											от 18 лет
										</span>
									</div>
									<div class="amount__range">
										<v-btn :icon="mdiMinus" density="comfortable" variant="tonal" color="#7059FF" @click="peopleCount.adults -= 1" :disabled="peopleCount.adults === 1"/>
										<strong class="amount__output">{{ peopleCount.adults }}</strong>
										<v-btn :icon="mdiPlus" density="comfortable" variant="tonal" color="#7059FF" @click="peopleCount.adults += 1"/>
									</div>
								</div>
								<div class="amount">
									<div class="amount__info">
										<strong class="amount__title">
											Дети
										</strong>
										<span class="amount__subtitle">
								от 0 до 17 лет
							</span>
									</div>
									<div class="amount__range">
										<v-btn :icon="mdiMinus" density="comfortable" variant="tonal" color="#7059FF" @click="peopleCount.children -= 1" :disabled="peopleCount.children === 0"/>
										<strong class="amount__output">{{ peopleCount.children }}</strong>
										<v-btn :icon="mdiPlus" density="comfortable" variant="tonal" color="#7059FF" @click="peopleCount.children += 1"/>
									</div>
								
								</div>
								<v-btn color="#7059FF"  width="100%" @click="guestSetMenuMobileIsOpen = false">Готово</v-btn>
							</v-card-item>
						</v-card>
					</v-menu>
					<v-chip style="background: #7059FF"  size="large" variant="flat"  :prepend-icon="mdiTuneVariant" class="search__filter-chip" @click="filtersModalIsOpen = true">Фильтры</v-chip>
				</div>
				<BtnPrimary  color="#7059FF"  :prepend-icon="mdiTuneVariant" class="search__filter-btn" @click="filtersModalIsOpen = true">Фильтры жилья</BtnPrimary>
			</div>
		
		</div>
		<div class="booking__desktop">
			<v-card class="booking__input booking__input_first booking__location" :ripple="{ class: 'ripple-color' }"  @click="openLocationModal">
				<v-icon :icon="mdiMagnify"></v-icon>
				<span v-if="!chosenCity">Выберите курорт</span>
				<div v-else>
					<span>{{chosenCity.cityName}}</span>
				</div>
			</v-card>
			<div :class="['booking__date']">
				<v-card class="booking__input" :ripple="{ class: 'ripple-color' }"  @click="openSetDateModal">
					<v-icon :icon="mdiCalendarMonthOutline"></v-icon>
					<span v-if="!dates.from">Заезд</span>
					<span v-else>{{beautifyDate(dates.from)}}</span>
				</v-card>
				<v-card class="booking__input" :ripple="{ class: 'ripple-color' }"  @click="openSetDateModal">
					<v-icon :icon="mdiCalendarMonthOutline"></v-icon>
					<span v-if="!dates.to">Выезд</span>
					<span v-else>{{beautifyDate(dates.to)}}</span>
				</v-card>
			</div>
			<v-menu :close-on-content-click="false" v-model="guestSetMenuIsOpen">
				<template v-slot:activator="{ props }">
					<v-card class="booking__input booking__input_people"  v-bind="props" :ripple="{ class: 'ripple-color' }">
						<v-icon :icon="mdiAccountOutline"></v-icon>
						<span>{{ describedGroup }}</span>
					</v-card>
				</template>
				<v-card >
					<v-card-item>
						<div class="amount">
							<div class="amount__info">
								<strong class="amount__title">
									Взрослые
								</strong>
								<span class="amount__subtitle">
							от 18 лет
						</span>
							</div>
							<div class="amount__range">
								<v-btn :icon="mdiPlus" density="comfortable" variant="tonal" color="#7059FF" @click="peopleCount.adults -= 1" :disabled="peopleCount.adults === 1"/>
								<strong class="amount__output">{{ peopleCount.adults }}</strong>
								<v-btn :icon="mdiPlus" density="comfortable" variant="tonal" color="#7059FF" @click="peopleCount.adults += 1"/>
							</div>
						</div>
						<div class="amount">
							<div class="amount__info">
								<strong class="amount__title">
									Дети
								</strong>
								<span class="amount__subtitle">
							от 0 до 17 лет
						</span>
							</div>
							<div class="amount__range">
								<v-btn :icon="mdiMinus" density="comfortable" variant="tonal" color="#7059FF" @click="peopleCount.children -= 1" :disabled="peopleCount.children === 0"/>
								<strong class="amount__output">{{ peopleCount.children }}</strong>
								<v-btn :icon="mdiPlus" density="comfortable" variant="tonal" color="#7059FF" @click="peopleCount.children += 1"/>
							</div>
						
						</div>
						<v-btn color="#7059FF"  width="100%" @click="guestSetMenuIsOpen = false">Готово</v-btn>
					</v-card-item>
				</v-card>
			</v-menu>
			<div class="booking__submit">
				<BtnPrimary @click="scrollBottom" :append-icon="mdiArrowRightCircleOutline" width="100%" class="booking__submit_btn"  color="#7059FF"  >Найти жилье</BtnPrimary>
			</div>
		</div>
	
		
	
	</div>
	<BookingSearchLocation/>
	<BookingSetDate/>
</template>

<style scoped lang="scss">


@media screen and (max-width: 950px)  {
	.booking__desktop {
		display: none !important;
	}
	.booking__mobile {
		display: block !important;
	}
	
	.search__filter-btn {
		display: none;
	}
}

@media screen and (max-width: 450px) {
	.search__submit-btn {
		display: none !important;
	}
	.search__filter-chip {
		display: none;
	}
	.search__filter-btn {
		display: flex !important;
		width: 100%;
	}
}

.booking__mobile {
	display: none;
	
	.booking__input {
		background: $bg-input;
		
		height: 40px;
		padding-left: 8px;
		display: flex;
		align-items: center;
		gap: 8px;
		width: 100%;
		
		box-shadow: none;
	}
	
	.booking__location {
		background: rgba(255, 255, 255, .8) !important;
		padding-left: 16px;
		width: 100%;
		display: flex;
		gap: 8px;
		align-items: center;
		height: 50px;
		
		box-shadow: none !important;
		border: 1px solid $light-gray;
		border-radius: 16px;
	}
	
	.search__bar {
		display: flex;
		gap: 16px;
		align-items: center;
		margin-bottom: 16px;
		
		.booking__input {
			margin-bottom: 0 !important;
		}
		
	}
	
}








.amount {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 16px;
	background: #FFFFFF;
	&__info  {
		& > * {
			display: block;
		}
	}
	
	&__range {
		display: flex;
		gap: 8px;
		align-items: center;
	}
	
}




.booking {
	

	width: 100%;
	

	
	&__date {
		display: flex;
		gap: 16px;
	}
	
	
}

.booking__desktop {
	color: $text-main;
	display: grid;
	grid-template-columns: 270px 1fr .7fr 170px;
	align-items: center;
	box-shadow: $elevation;
	border: 1px solid $light-gray;
	//margin-top: 32px;
	background: rgba(255, 255, 255, 0.90);
	border-radius: 16px;
	padding-right: 16px;
	
	.booking__input {
		background: rgba(255, 255, 255, 0) !important;
		padding-left: 16px;
		width: 100%;
		display: flex;
		gap: 8px;
		align-items: center;
		height: 65px;
		border-radius: 0;
		box-shadow: none;
		
		&.error span {
			color: #ff7878;
		}
		
		&:not(&_first)::before {
			background: $light-gray;
			bottom: 15px;
			content: "";
			left: -1px;
			position: absolute;
			top: 15px;
			transition: opacity .2s ease;
			width: 2px;
		}
	}
}

</style>