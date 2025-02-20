<script setup lang="ts">

import useBooking from "~/modules/Booking/composables/useBooking";
import useListingBooking from "~/modules/Listing/composables/useListingBooking";
import ListingBookingSetDate from "~/modules/Listing/components/ListingBooking/ListingBookingSetDate.vue";
import useListing from "~/modules/Listing/composables/useListing";
import {
	mdiCalendarMonthOutline,
	mdiAccountOutline,
	mdiMinus,
	mdiPlus,
	mdiWhatsapp,
	mdiCalendarEditOutline, mdiCashCheck, mdiInformationVariant
} from "@mdi/js"
import BtnPrimary from "~/modules/Common/UI/BtnPrimary.vue";
import {parsePhone} from "~/modules/Common/Utils/phone.utils";
import BtnSecondary from "~/modules/Common/UI/BtnSecondary.vue";
import useBonus from "~/modules/Listing/composables/useBonus";
import {useAuthUser} from "~/modules/Auth/composables/useAuthUser";
import TelegramIcon from "~/modules/Listing/icons/TelegramIcon.vue";
import {BONUS_CACHE_BACK_PERCENT} from "../../constans";

const authUser = useAuthUser()
const {applyBonus} = useBonus()

const {target} = defineProps<{
	target: 'sidebar' | 'modal'
}>();


const {calculateDaysBetweenDates} = useBooking()
const {listing, chosenRoomId} = useListing()
const {
	beautifyDate,
} = useBooking();


const {peopleCount, openSetDateModal, dateModal, listingBookingConfirmModal, describeGroup} = useListingBooking();
const whatsLink = computed(() => `whatsapp://send?phone=${listing.value.manager.phone}&text=Здравствуйте! Расскажите подробнее про: ${listing.value.title}. https://aura-tour-abkhazia.ru/listing/${route.params.id}`)

const route = useRoute();

const guestSetMenuIsOpen = ref(false);

const dates = computed(() => {
	const {checkIn, checkOut} = dateModal.value
	return {checkIn, checkOut}
});

const isAdmin = computed(() => {
	return authUser.value && ['ADMIN', 'MANAGER'].includes(authUser.value.role);
})

const ownerPhone = listing.value.owner?.phone ? await parsePhone(listing.value.owner.phone) : null;
const managerPhone = await parsePhone(listing.value.manager.phone)


</script>

<template>
	<div class="booking listing-block contacts" v-if="isAdmin && listing.owner">
		<div class="id">Владелец объекта</div>
		<div class="name">{{listing.owner.name}}</div>
		<div class="phone">{{ownerPhone}}</div>
		<div class="contacts__messengers">
			<v-btn class="contacts__btn" variant="tonal"  :href="`whatsapp://send?phone=${listing.owner.phone}`" :prepend-icon="mdiWhatsapp" color="#2F9E45">
				WhatsApp
			</v-btn>
		</div>
	</div>
	<div class="booking listing-block contacts" v-if="listing.manager">
		<v-avatar v-if="listing.manager.avatar" size="60">
			<v-img :src="listing.manager.avatar.urlMin"/>
		</v-avatar>
		<v-avatar v-else color="#7059FF" size="60">{{listing.manager.name[0]}}</v-avatar>
		<div class="name">{{listing.manager.name}}</div>
		<div class="phone">{{managerPhone}}</div>
		<div class="id">Номер объявления: №{{listing.id}}</div>
		<div class="contacts__messengers">
			<v-btn class="contacts__btn" variant="tonal"  :href="whatsLink" :prepend-icon="mdiWhatsapp" color="#2F9E45">
				WhatsApp
			</v-btn>
			<v-btn class="contacts__btn" variant="tonal" v-if="listing.manager.telegram" :href="`https://t.me/${listing.manager.telegram}`" color="#24A1DE">
				<template #prepend>
					<TelegramIcon/>
				</template>
				Телеграмм
			</v-btn>
		</div>
	</div>
	<div v-else class="booking listing-block contacts">
		После проверки объявления к нему будет прикреплен менеджер.
	</div>
	<div class="booking listing-block">
		<div class="booking__main">
			<div class="booking__date">
				<v-card class="booking__input" :ripple="{ class: 'ripple-color' }" @click="openSetDateModal">
					<span class="label">Заезд</span>
					<div class="booking__input-body">
						<v-icon :icon="mdiCalendarMonthOutline" color="#333D46"></v-icon>
						<span v-if="!dates.checkIn">Дата</span>
						<span v-else>{{ beautifyDate(dates.checkIn) }}</span>
					</div>
				</v-card>
				<v-card class="booking__input" :ripple="{ class: 'ripple-color' }" @click="openSetDateModal">
					<span class="label">Выезд</span>
					<div class="booking__input-body">
						<v-icon :icon="mdiCalendarMonthOutline" color="#333D46"></v-icon>
						<span v-if="!dates.checkOut">Дата</span>
						<span v-else>{{ beautifyDate(dates.checkOut) }}</span>
					</div>
				</v-card>
				
				
			</div>
			<v-menu :close-on-content-click="false" v-model="guestSetMenuIsOpen">
				<template v-slot:activator="{ props }">
					<v-card v-bind="props" class="booking__input" :ripple="{ class: 'ripple-color' }">
						<span class="label">Кол-во гостей</span>
						<div class="booking__input-body">
							<v-icon :icon="mdiAccountOutline" color="#333D46"></v-icon>
							<span>{{ describeGroup(peopleCount.adults, peopleCount.children) }}</span>
						</div>
					</v-card>
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
								<v-btn :icon="mdiMinus" density="comfortable" variant="tonal" color="#7059FF"
								       @click="peopleCount.adults -= 1" :disabled="peopleCount.adults === 1"/>
								<strong class="amount__output">{{ peopleCount.adults }}</strong>
								<v-btn :icon="mdiPlus" density="comfortable" variant="tonal" color="#7059FF"
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
								<v-btn :icon="mdiMinus" density="comfortable" variant="tonal" color="#7059FF"
								       @click="peopleCount.children -= 1" :disabled="peopleCount.children === 0"/>
								<strong class="amount__output">{{ peopleCount.children }}</strong>
								<v-btn :icon="mdiPlus" density="comfortable" variant="tonal" color="#7059FF"
								       @click="peopleCount.children += 1"/>
							</div>
						
						</div>
						<v-btn color="#7059FF" width="100%" @click="guestSetMenuIsOpen = false">Готово</v-btn>
					</v-card-item>
				</v-card>
			</v-menu>
		</div>
		<p class="dates-alert mb-4" v-if="!listing.calculatedPrices">Выберите даты поездки</p>
		<BtnPrimary block @click="openSetDateModal" v-if="!listing.calculatedPrices">Проверить цены</BtnPrimary>
		<div class="order-info" v-if="!listing.isHotelType">
			<div class="price-block">
				<span class="days">За сутки</span>
				<span class="price">{{listing.calculatedPrices ? listing.calculatedPrices.dailyPrice.toLocaleString() : listing.minPrice.toLocaleString()}} ₽</span>
			</div>
			<div v-if="listing.calculatedPrices">
<!--				<div class="mt-4" v-if="authUser && authUser.bonusPoints > 0">Количество бонусов: <strong>{{authUser.bonusPoints}}</strong></div>-->
<!--				<v-switch-->
<!--					v-if="authUser && authUser.bonusPoints > 0"-->
<!--					v-model="applyBonus"-->
<!--					label="Списать бонусы"-->
<!--					color="rgb(112, 89, 255)"-->
<!--					hide-details-->
<!--				/>-->
				<div class="price-block">
					<span class="days">За {{formatDays(listing.calculatedPrices.daysCount)}}</span>
					<div class="price" style="color: #2a2536;" v-if="authUser && authUser.bonusPoints > 0 && applyBonus">
						<span>{{(listing.calculatedPrices.totalPrice - authUser.bonusPoints).toLocaleString()}} ₽</span>
						<strike style="color: #6a6d81; margin-left: 8px;">{{listing.calculatedPrices.totalPrice.toLocaleString()}} ₽</strike>
					</div>
					<span class="price" style="color: #2a2536;" v-else>{{listing.calculatedPrices.totalPrice.toLocaleString()}} ₽</span>
				</div>
			</div>
			
			<v-alert
				type="info"
				variant="tonal"
				text="Жилье недоступно для выбранного количества гостей"
				v-if="!listing.isHotelType && listing.places < peopleCount.adults + peopleCount.children"
				class="min-days-alert"
			></v-alert>
			<BtnSecondary v-if="listing.minDaysOrder > listing.calculatedPrices?.daysCount" block class="mt-6" @click="openSetDateModal">Изменить даты</BtnSecondary>
			<BtnPrimary v-if="listing.calculatedPrices" block class="mt-6" @click="listingBookingConfirmModal = true">Оставить заявку</BtnPrimary>
		</div>
		<v-alert
			type="info"
			variant="tonal"
			:text="`Минимальный срок аренды: ${formatDays(listing.minDaysOrder)}.`"
			v-if="listing.minDaysOrder > listing.calculatedPrices?.daysCount"
			class="mt-4"
		></v-alert>
		<div v-if="listing.isHotelType && dates.checkIn && dates.checkOut">
			<BtnSecondary block class="mt-6" @click="openSetDateModal" :prepend-icon="mdiCalendarEditOutline">Изменить даты</BtnSecondary>
<!--			<div v-if="authUser && authUser.bonusPoints > 0">-->
<!--				<div class="mt-4">Количество бонусов: <strong>{{authUser.bonusPoints}}</strong></div>-->
<!--				<v-switch-->
<!--					v-model="applyBonus"-->
<!--					label="Списать бонусы"-->
<!--					color="rgb(112, 89, 255)"-->
<!--					hide-details-->
<!--					block-->
<!--				/>-->
<!--			</div>-->
		</div>
<!--		<div v-if="!listing.isHotelType && !applyBonus && listing.calculatedPrices?.totalPrice" style="display: flex; justify-content: center; margin-top: 24px;">-->
<!--			<v-chip-->
<!--				:prepend-icon="mdiCashCheck"-->
<!--				:append-icon="mdiInformationVariant"-->
<!--				variant="outlined"-->
<!--				v-tooltip:bottom="'Зарегестрируйтесь у нас на сайте и получайте кэшбэк за каждое бронирование!'"-->
<!--			>Вернем {{(listing.calculatedPrices?.totalPrice * BONUS_CACHE_BACK_PERCENT).toFixed(0)}} ₽ бонусами</v-chip>-->
<!--		</div>-->
	</div>
	
	<ListingBookingSetDate/>
</template>

<style scoped lang="scss">
	.contacts {
		text-align: center;
		
		.contacts__messengers {
			display: flex;
			gap: 8px;
			justify-content: center;
			flex-wrap: wrap;
			margin-top: 24px;
		}
		.name {
			font-size: 24px;
			font-weight: 600;
			color: $text-main;
			margin-top: 16px;
			margin-bottom: 8px;
		}
		.phone {
			font-size: 18px;
			margin-bottom: 8px;
		}
		@media screen and (max-width: 630px){
			.name {
				font-size: 20px;
			}
			
		}
		.id {
			margin-bottom: 16px;
			color: $text-gray;
		}
	}
	.order-info {
		margin-top: 16px;
		.total {
			color: #2a2536;
			font-size: 16px;
			font-weight: 500;
			line-height: 24px;
			margin-bottom: 8px;
		}
		.price {
			font-weight: 500;
		}
		.days {
			color: #6a6d81;
			line-height: 24px;
		}
		.price-block {
			color: #6a6d81;
			margin-bottom: 8px;
			display: flex;
			justify-content: space-between;
		}
	}
	
	.dates-alert {
		text-align: center;
		margin-top: 16px;
		font-size: 14px;
		color: #fe5454;
	}
	.booking {
		&__date {
			display: flex;
			gap: 16px;
			margin-bottom: 16px;
		}
		
		&__contact-btn {
			width: 230px;
			margin-bottom: 16px;
		}
		
		&__input {
			width: 100%;
			background: #F1F3F9;
			border-radius: 8px;
			box-shadow: none !important;
			padding: 1px 12px 8px 12px;
			color: #333D46;
			
			.label {
				font-size: 12px;
			}
			&-body {
				display: flex;
				font-size: 14px;
				gap: 8px;
				//margin-top: 4px;
			}
		}
	}
	
</style>