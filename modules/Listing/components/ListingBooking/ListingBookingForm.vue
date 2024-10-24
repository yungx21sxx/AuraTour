<script setup lang="ts">

import useBooking from "~/modules/Booking/composables/useBooking";
import useFilters from "~/modules/Search/composables/useFilters";

import type {IGuestHouseRoom} from "~/modules/Listing/types/response.types";
import useListingBooking from "~/modules/Listing/composables/useListingBooking";
import ListingBookingSetDate from "~/modules/Listing/components/ListingBooking/ListingBookingSetDate.vue";
import useListing from "~/modules/Listing/composables/useListing";

const {target} = defineProps<{
	target: 'sidebar' | 'modal'
}>();


const {calculateDaysBetweenDates} = useBooking()
const {listing, chosenRoomId, chosenRoom} = useListing()

const {
	beautifyDate,
} = useBooking();

const {peopleCount, openSetDateModal, dateModal, listingBookingConfirmModal, describeGroup} = useListingBooking();

const {parseQueryParams, filtersModalIsOpen, refreshBookingFilters} = useFilters();

const route = useRoute()


function countDays(startDate: Date, endDate: Date): number {
	const oneDay = 24 * 60 * 60 * 1000; // Количество миллисекунд в одном дне
	const differenceInTime = endDate.getTime() - startDate.getTime();
	return Math.round(differenceInTime / oneDay);
}

const dates = computed(() => {
	const {from, to} = dateModal.value
	return {from, to}
})

const guestSetMenuIsOpen = ref(false);
const roomsProps = (room: IGuestHouseRoom) => ({
	title: room.name,
	subtitle: `${room.totalPrice?.toLocaleString('ru-RU')} ₽ за ${formatDays(listing.value.daysCount)}`
})



const prepayListing = computed(() => Math.trunc(listing.value.totalPrice * 0.15))
const bookingPayListing = computed(() => Math.trunc(listing.value.totalPrice - listing.value.totalPrice * 0.15))

const prepayChosenRoom = computed(() => {
	if (!chosenRoom.value) return null;

	return Math.trunc(chosenRoom.value.totalPrice * 0.15);
})

const bookingPayChosenRoom = computed(() => {
	if (!chosenRoom.value) return null;

	return Math.trunc(chosenRoom.value.totalPrice - chosenRoom.value.totalPrice * 0.15);
})

const whatsLink = computed(() => `whatsapp://send?phone=+7${listing.value.phoneRaw}&text=Здравствуйте! Расскажите подробнее про: ${listing.value.title}. https://aura-tour-abkhazia.ru/listing/${route.params.id}`)

const notMinDays = computed(() => listing.value.minDaysOrder > countDays(dates.value.from || new Date(), dates.value.to || new Date()))


</script>

<template>
	<div class="booking">
		<div class="booking__main listing-block">
			<div class="booking__date">
				<div class="booking__input-body">
					<span class="label">Заезд</span>
					<v-card class="booking__input" :ripple="{ class: 'ripple-color' }" @click="openSetDateModal">
						<v-icon>mdi-calendar-month-outline</v-icon>
						<span v-if="!dates.from">Заезд</span>
						<span v-else>{{ beautifyDate(dates.from) }}</span>
					</v-card>
				</div>
				<div class="booking__input-body">
					<span class="label">Выезд</span>
					<v-card class="booking__input" :ripple="{ class: 'ripple-color' }" @click="openSetDateModal">
						<v-icon>mdi-calendar-month-outline</v-icon>
						<span v-if="!dates.to">Выезд</span>
						<span v-else>{{ beautifyDate(dates.to) }}</span>
					</v-card>
				</div>
				
			</div>
			<v-menu :close-on-content-click="false" v-model="guestSetMenuIsOpen">
				<template v-slot:activator="{ props }">
					<div class="booking__input-body">
						<span class="label">Кол-во гостей</span>
						<v-card class="booking__input" v-bind="props">
							<v-icon>mdi-account-outline</v-icon>
							<span>{{ describeGroup(peopleCount.adults, peopleCount.children) }}</span>
						</v-card>
					</div>
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
								<v-btn icon="mdi-minus" density="comfortable" variant="tonal" color="#7059FF"
								       @click="peopleCount.adults -= 1" :disabled="peopleCount.adults === 1"/>
								<strong class="amount__output">{{ peopleCount.adults }}</strong>
								<v-btn icon="mdi-plus" density="comfortable" variant="tonal" color="#7059FF"
								       @click="peopleCount.adults += 1"/>
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
								<v-btn icon="mdi-minus" density="comfortable" variant="tonal" color="#7059FF"
								       @click="peopleCount.children -= 1" :disabled="peopleCount.children === 0"/>
								<strong class="amount__output">{{ peopleCount.children }}</strong>
								<v-btn icon="mdi-plus" density="comfortable" variant="tonal" color="#7059FF"
								       @click="peopleCount.children += 1"/>
							</div>
						
						</div>
						<v-btn color="#7059FF" width="100%" @click="guestSetMenuIsOpen = false">Готово</v-btn>
					</v-card-item>
				</v-card>
			</v-menu>
			
			<div class="booking__total" v-if="dates.from && dates.to">
				<div class="booking__order-info" v-if="listing.rooms.length === 0">
					<div class="booking__total-price booking__input_info booking__input" >
						<span>Итого за {{formatDays(listing.daysCount)}}:</span> <span>{{listing.totalPrice?.toLocaleString('ru-RU')}} ₽</span>
					</div>
<!--					<div class="booking__input booking__input_info">-->
<!--						<span>Предоплата</span>-->
<!--						<span>{{prepayListing.toLocaleString('ru-RU')}} ₽</span>-->
<!--					</div>-->
<!--					<div class="booking__input booking__input_info">-->
<!--						<span>Оплата при заселении</span>-->
<!--						<span>{{bookingPayListing.toLocaleString('ru-RU')}} ₽</span>-->
<!--					</div>-->
				</div>
				<div class="booking__order-info" v-else>
					<v-select density="comfortable" v-model="chosenRoomId" item-value="id" class="mb-4 mt-4" variant="solo" bg-color="#F0F3F7"  :item-props="roomsProps"  :items="listing.rooms" label="Выберите номер"/>
					<div class="booking__input mt-8 booking__input_info" v-if="chosenRoom">
						<span>Итого за {{formatDays(listing.daysCount)}}:</span> <span>{{chosenRoom.totalPrice?.toLocaleString('ru-RU')}} ₽</span>
					</div>
<!--					<div class="booking__input booking__input_info" v-if="prepayChosenRoom">-->
<!--						<span>Предоплата</span>-->
<!--						<span>{{prepayChosenRoom?.toLocaleString('ru-RU')}} ₽</span>-->
<!--					</div>-->
<!--					<div class="booking__input booking__input_info" v-if="bookingPayChosenRoom">-->
<!--						<span>Оплата при заселении</span>-->
<!--						<span>{{bookingPayChosenRoom?.toLocaleString('ru-RU')}} ₽</span>-->
<!--					</div>-->
				</div>
				
				<v-alert
					class="booking__alert mb-4"
					v-if="notMinDays"
					closable
					type="info"
					variant="tonal"
					color="#7059FF"
				>
					Минимальный срок аренды: {{formatDays(listing.minDaysOrder)}}.
				</v-alert>
				
				
				<v-btn width="100%" color="#7059FF" class="mt-2" :disabled="notMinDays"  @click="listingBookingConfirmModal = true">
					Забронировать
				</v-btn>
			</div>
			<div class="booking__dates-alert" v-else>
				<div class="booking__input booking__input_info mt-6">
					<span>Цена за сутки</span>
					<span>от {{listing.dailyPrice.toLocaleString('ru-RU')}} ₽</span>
				</div>
				<v-alert
					type="info"
					variant="tonal"
				>
					<template #text>
						<div class="alert">
							<h4 class="alert__title">Укажите даты поездки</h4>
							<p class="mb-4" style="text-align: left">Выберите даты поездки чтобы забронировать жилье онлайн.</p>
							<v-btn @click="openSetDateModal" color="#7059FF">Выбрать даты</v-btn>
						</div>
					</template>
				</v-alert>
				<p>Минимальный срок аренды: <strong>{{formatDays(listing.minDaysOrder)}}</strong></p>
			</div>
		</div>
		<div class="booking__info">
			<div class="booking__phone">
				<div class="booking__renter-name">
					{{listing.renterName}}
				</div>
				<NuxtLink  class="booking__phone_link" :to="`tel:/+7${listing.phoneRaw}`">
					+7 {{listing.phone}}
				</NuxtLink>
				
			</div>
			<v-btn class="booking__whats" :href="whatsLink" prepend-icon="mdi-whatsapp"  color="#2F9E45">
				Написать в WhatsApp
			</v-btn>
			
			<div class="booking__description">
				Номер объявления:
			</div>
			<div class="booking__id">
				№ {{listing.id}}
			</div>
		</div>
	</div>
	
	<ListingBookingSetDate/>
</template>

<style scoped lang="scss">




.amount {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 16px;
	background: #FFFFFF;
	
	&__info {
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
	
	&__main {
		padding: 16px;
	}
	
	&__dates-alert {
		p {
			text-align: center;
			font-size: 14px;
			margin-top: 16px;
			color: $text-main;
		}
	}
	
	&__input-body .label {
		padding-bottom: 4px;
		display: block;
		font-size: 14px;
		color: #333D46;
	}
	
	&__total-price {
		margin-bottom: 16px;
		display: flex;
		justify-content: space-between;
		//margin-top: 32px;
		padding: 0 16px;
		span:last-child {
			font-weight: bold;
		}
	}
	
	&__desktop {
		display: grid;
		grid-template-columns: 1fr 1fr 250px;
		gap: 16px;
	}
	
	
	&__date {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 16px;
	}
	
	&__input {
		background: $bg;
		height: 40px;
		padding-left: 8px;
		margin-bottom: 16px;
		display: flex;
		align-items: center;
		gap: 8px;
		width: 100%;
		
		&_info {
			padding-left: 16px;
			padding-right: 16px;
			span:last-child {
				font-weight: bold;
				margin-left: auto;
			}
		}
		
		box-shadow: none;
	}
	&__info {
		text-align: center;
		margin-top: 16px;
	}
	&__phone {
		margin-bottom: 16px;
		&_info {
			color: #818487;
		}
		&_link {
			font-size: 18px;
			color: $text-main;
			text-decoration: none;
		}
	}
	
	&__whats {
		color: #FFFFFF !important;
		margin-bottom: 16px;
	}
	&__description {
		color: #818487;
		font-size: 14px;
		margin-bottom: 8px;
	}
	
	&__id {
		font-size: 18px;
		font-weight: bold;
	}
	
	
}





</style>