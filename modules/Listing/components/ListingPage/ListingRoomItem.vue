<script setup lang="ts">
	import type {IRoomResponse} from "~/modules/Listing/types/response.types";
	
	import useListing from "~/modules/Listing/composables/useListing";
	import useGallery from "~/modules/Listing/composables/useGallery";
	import BtnPrimary from "~/modules/Common/UI/BtnPrimary.vue";
	import useListingBooking from "~/modules/Listing/composables/useListingBooking";
	import {mdiCalendar} from "@mdi/js";
	import {getWordWithProperEnding} from "~/utils/utils";
	import FitIcon from "~/modules/Listing/icons/FitIcon.vue";
	import RoomsIcon from "~/modules/Listing/icons/RoomsIcon.vue";
	import BedIcon from "~/modules/Listing/icons/BedIcon.vue";
	import useBonus from "~/modules/Listing/composables/useBonus";
	import {useAuthUser} from "~/modules/Auth/composables/useAuthUser";
	
	const {listing} = useListing();
	const {openSetDateModal, chosenRoomId, listingBookingConfirmModal} = useListingBooking()
	const {currentPhoto} = useGallery()
	const {applyBonus} = useBonus()
	
	function openGalleryModal(roomId: number, photoIndex: number) {
		currentPhoto.value.room = {roomId, photoIndex}
		currentPhoto.value.modal = true
	}
	
	function openBookingModal(roomId: number) {
		chosenRoomId.value = roomId;
		listingBookingConfirmModal.value = true;
	}
	
	const authUser = useAuthUser()
	
	const props = defineProps<{
		room: IRoomResponse
	}>();
	
	const showPrices = ref(false);
	const priceContainer = ref(null);
	watch(showPrices, async (newValue) => {
		await nextTick(); // Ждём обновления DOM
		if (newValue) {
			priceContainer.value.style.maxHeight = priceContainer.value.scrollHeight + "px";
		} else {
			priceContainer.value.style.maxHeight = "0px";
		}
	});
	
	const togglePrices = () => showPrices.value = !showPrices.value;
	
	
	const months = [
		"января", "февраля", "марта", "апреля", "мая", "июня",
		"июля", "августа", "сентября", "октября", "ноября", "декабря"
	];
	
	const formattedPricePeriods = computed(() => {
		if (!props.room.pricePeriods || props.room.pricePeriods.length === 0)
			return []
		
		const { pricePeriods } = props.room;
		return pricePeriods
			.map(({ price, startDay, endDay, startMonth, endMonth }) => {
				const start = `${startDay} ${months[startMonth - 1]}`;
				const end = `${endDay} ${months[endMonth - 1]}`;
				const range = startMonth === endMonth ? `${start} - ${end}` : `${start} - ${end}`;
				return { price, range };
			})
			.sort((a, b) => {
				// Сортируем сначала по стартовому месяцу, затем по стартовому дню
				const aStartMonth = pricePeriods.find(p => p.price === a.price)?.startMonth || 0;
				const bStartMonth = pricePeriods.find(p => p.price === b.price)?.startMonth || 0;
				const aStartDay = pricePeriods.find(p => p.price === a.price)?.startDay || 0;
				const bStartDay = pricePeriods.find(p => p.price === b.price)?.startDay || 0;
				return aStartMonth - bStartMonth || aStartDay - bStartDay;
			});
	});

</script>

<template>
	<div
		:key="room.id"
		:class="['room mt-8', {
			'no-photos': room.photos.length === 0
		}]"
	
	>
		<div class="room__main">
			<v-carousel
				class="room__carousel"
				height="200px"
				hide-delimiters
				show-arrows="hover"
				v-if="room.photos.length > 0"
			>
				<v-carousel-item
					v-for="photo of room.photos"
					:src="photo.urlMin"
					@click="openGalleryModal(room.id, photo.id)"
					cover
				></v-carousel-item>
			</v-carousel>
			<div class="room__info">
				<h3 class="room__title">{{room.name}}</h3>
				<div class="room__amenities">
							<span
								v-for="(amenity, index) of room.amenities"
								:class="['room__amenity', {
									'room__amenity_last': index === room.amenities.length - 1
								}]"
							>{{amenity}}</span>
				</div>
				<div class="listing-chips">
					<div class="chip">
						<BedIcon/>
						<span>
									{{getWordWithProperEnding( room.places, 'место')}} {{room.extraPlaces > 0 ? `, ${room.extraPlaces} доп.` : ''}}
								</span>
					</div>
					<div class="chip">
						<FitIcon/>
						<span>
									{{room.area}} м<sup>2</sup>
								</span>
					</div>
					<div class="chip">
						<RoomsIcon/>
						<span>
									{{getRoomString(room.badCount)}}
								</span>
					</div>
				</div>
				<div class="room__order order">
					<div class="order__info">
						<div class="order__price" v-if="room.calculatedPrices && applyBonus && authUser">
							<div class="price-bonus price">
								<span>{{(room.calculatedPrices.totalPrice - authUser.bonusPoints).toLocaleString('ru-RU')}} ₽</span>
								<strike style="color: #6a6d81; margin-left: 8px;">{{room.calculatedPrices.totalPrice.toLocaleString('ru-RU')}} ₽</strike>
							</div>
							<span class="order__price_info">Цена за {{formatDays(room.calculatedPrices.daysCount)}}</span>
						</div>
						<div class="order__price" v-if="room.calculatedPrices && !applyBonus">
							<div class="price">{{room.calculatedPrices.totalPrice?.toLocaleString('ru-RU')}} ₽</div>
							<span class="order__price_info">Цена за {{formatDays(room.calculatedPrices.daysCount)}}</span>
						</div>
						
						<div class="order__price" v-if="!room.calculatedPrices">
							<div class="price">от {{room.minPrice.toLocaleString('ru-RU')}} ₽</div>
							<span class="order__price_info">Цена за 1 ночь</span>
						</div>
					</div>
					<BtnPrimary
						class="order__btn"
						color="#7059FF"
						v-if="room.calculatedPrices"
						@click="openBookingModal(room.id)"
					>
						Оставить заявку
					</BtnPrimary>
					<BtnPrimary
						class="order__btn"
						color="#7059FF"
						v-else
						@click="openSetDateModal()"
					>
						Проверить цены
					</BtnPrimary>
				</div>
				<v-btn
					variant="text"
					:prepend-icon="mdiCalendar"
					style="margin-left: -12px; margin-top: 4px;"
					@click="togglePrices"
					v-if="room.pricePeriods.length > 0"
				>
					<v-fade-transition mode="out-in">
						<span :key="showPrices">{{ showPrices ? 'Скрыть цены' : 'См. все цены' }}</span>
					</v-fade-transition>
				</v-btn>
				
				<v-scroll-y-transition>
					<div
						ref="priceContainer"
						:class="{ expanded: showPrices }"
						style="overflow: hidden; max-height: 0; transition: max-height 0.3s ease-in-out"
					>
						<v-table>
							<thead>
							<tr>
								<th class="text-left">Дата</th>
								<th class="text-left">Цена</th>
							</tr>
							</thead>
							<tbody>
							<tr v-for="period of formattedPricePeriods" :key="period.range">
								<td>{{ period.range }}</td>
								<td>{{ period.price.toLocaleString('ru-RU') }} ₽</td>
							</tr>
							</tbody>
						</v-table>
					</div>
				</v-scroll-y-transition>
			
				<div class="room__included" v-if="room.includedDescription">{{room.includedDescription}}</div>
			</div>
		</div>
	
	
	</div>
</template>

<style scoped lang="scss">


@media screen and (max-width: 640px) {
	.room {
		&__main {
			grid-template-columns: 1fr !important;
		}
	}
}



.chip {
	display: flex;
	align-items: center;
	gap: 8px;
	font-size: 14px;
	border-radius: 999px;
	color: #626262;
	background: #F1F3F9;
	padding: 3px 12px;
}

.rooms__title {
	margin-bottom: 8px;
}

.room {
	&.no-photos &__main {
		display: block !important;
	}
	
	&__included {
		margin-top: 8px;
		color: $text-gray !important;
		font-size: 14px;
	}
	&__main {
		display: grid;
		grid-template-columns: 250px 1fr;
		gap: 16px;
	}
	&__title {
		margin-bottom: 8px;
	}
	
	&__carousel {
		height: 200px;
		border-radius: 7px;
	}
	&__amenities {
		display: flex;
		flex-wrap: wrap;
		margin-bottom: 16px;
	}
	&__amenity {
		color: $text-gray;
		//margin-right: 8px;
		display: flex;
		align-items: center;
		font-size: 14px;
		&:not(&_last)::after {
			align-items: center;
			content: "·";
			display: flex;
			height: 14px;
			font-size: 20px;
			justify-content: center;
			left: -14px;
			width: 14px;
		}
	}
}

.order {
	display: flex;
	margin-top: 16px;
	flex-wrap: wrap;
	gap: 16px;
	justify-content: space-between;
	align-items: center;
	.price {
		font-weight: bold;
		font-size: 20px;
	}
}



</style>