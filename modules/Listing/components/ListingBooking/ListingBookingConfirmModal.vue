<script setup lang="ts">
import useListingBooking from "~/modules/Listing/composables/useListingBooking";
import useListing from "~/modules/Listing/composables/useListing";
import useBooking from "~/modules/Booking/composables/useBooking";
import type {BookingCreateDTO} from "~/modules/Listing/types/dto.types";
import useTelegram from "~/composables/UseTelegram";
import {useAuthUser} from "~/modules/Auth/composables/useAuthUser";
import {mdiAccountOutline, mdiCalendarMonthOutline, mdiMinus, mdiPlus, mdiCircleSmall, mdiHelp, mdiCheckCircle, mdiClose} from "@mdi/js";
import type {IRoomResponse} from "~/modules/Listing/types/response.types";
import type {H3Error} from "h3";
import useBonus from "~/modules/Listing/composables/useBonus";

import {PREPAY_PERCENT, BONUS_CACHE_BACK_PERCENT} from "../../constans";

const {listingBookingConfirmModal, dateModal, listingBookingInfo, openSetDateModal, peopleCount, describeGroup, chosenRoomId} = useListingBooking();
const {beautifyDate, describedGroup} = useBooking()
const {listing} = useListing();
const {sendBookingInfo} = useTelegram()
const {isMobileOrTablet} = useDevice();
const route = useRoute();
const pending = ref(false);
const {applyBonus} = useBonus()

const authUser = useAuthUser();

const dates = computed(() => {
	//@ts-ignore
	const {checkIn, checkOut} = dateModal.value
	return {checkIn, checkOut}
});

let bookingFormData = ref({
	userName: authUser.value?.name || '',
	userSurname: authUser.value?.surname || '',
	userPhone: authUser.value?.phone || '',
	comment: '',
	transfer: false,
	transferComment: ''
});
const guestSetMenuIsOpen = ref(false)

const formRules = {
	name: [(v: string) => !!v || 'Введите имя'],
	surname: [(v: string) => !!v || 'Введите фамилию'],
	phone: [(v: string) => !!v || 'Введите номер'],
}
const serverErrors = ref([]);
const formRef = ref();
const step = ref(1);
const chosenRoom = computed<IRoomResponse | null>(() => {
	const room = listing.value.rooms.find(room => room.id === chosenRoomId.value);
	if (!room) return null;
	return room;
})

interface IPrices {
	daysCount: number
	totalPrice: number,
	prepay: number,
	atCheckIn: number,
	totalPriceWithBonus: number | null,
	prepayWithBonus: number | null,
	atCheckInWithBonus: number | null
}

const prices = computed<IPrices | null>(() => {
	const withBonus = applyBonus.value && authUser.value && authUser.value.bonusPoints > 0;
	
	let daysCount: number;
	let totalPrice: number;
	let prepay: number;
	let atCheckIn: number;
	let totalPriceWithBonus: number | null = null;
	let prepayWithBonus: number | null = null;
	let atCheckInWithBonus: number | null = null;
	
	if (chosenRoom && chosenRoom.value?.calculatedPrices) {
		daysCount = chosenRoom.value.calculatedPrices.daysCount;
		totalPrice = chosenRoom.value.calculatedPrices.totalPrice;
	} else if (listing.value.calculatedPrices) {
		daysCount = listing.value.calculatedPrices.daysCount;
		totalPrice = listing.value.calculatedPrices.totalPrice;
	} else {
		return null;
	}
	
	// Расчет предоплаты и оплаты при заселении
	prepay = parseInt((totalPrice * PREPAY_PERCENT).toFixed(0));
	atCheckIn = parseInt((totalPrice - prepay).toFixed(0));
	
	if (withBonus && authUser.value) {
		// Учитываем бонусы
		totalPriceWithBonus = totalPrice - authUser.value.bonusPoints;
		
		// Проверяем, чтобы итоговая цена не была отрицательной
		totalPriceWithBonus = Math.max(totalPriceWithBonus, 0);
		
		prepayWithBonus = parseInt((totalPriceWithBonus * PREPAY_PERCENT).toFixed(0));
		atCheckInWithBonus = parseInt((totalPriceWithBonus - prepayWithBonus).toFixed(0));
	}
	
	return {
		daysCount,
		totalPrice,
		prepay,
		atCheckIn,
		totalPriceWithBonus,
		prepayWithBonus,
		atCheckInWithBonus,
	};
});

async function submit() {
	if (formRef.value) {
		const { valid } = await formRef.value.validate();
		if (!valid) {
			return;
		}
	} else {
		console.error('Form ref is not defined');
		return;
	}
	if (!prices) return;
	pending.value = true;
	serverErrors.value = [];
	
	const applyBonusToBooking = authUser.value && applyBonus.value && authUser.value.bonusPoints > 0
	
	const dto: BookingCreateDTO = {
		...listingBookingInfo.value,
		...bookingFormData.value,
		totalPrice: prices.value?.totalPrice,
		prepay: prices.value?.prepay,
		daysCount: prices.value?.daysCount,
		listingId: listing.value.id,
		roomId: chosenRoomId.value,
		userId: authUser.value?.id || null,
		bonusApplied: applyBonusToBooking || false,
		bonusAppliedCount: applyBonusToBooking ? authUser.value?.bonusPoints : 0,
		totalPriceWithBonus: prices.value?.totalPriceWithBonus || 0,
		prepayWithBonus: prices.value?.prepayWithBonus || 0
	}
	try {
		const {success, uuid} = await $fetch('/api/bookings/create', {
			method: 'POST',
			body: dto
		})
		await sendBookingInfo(
				dto,
				`https://aura-tour-abkhazia.ru/listing/${listing.value.id}`,
				chosenRoom.value?.name || null,
			listing.value.manager.name
		);
		if (!authUser.value) {
			localStorage.setItem('bookingUUID', uuid);
		}
		step.value = 2;
		const defaultArgs = {
			userName: '',
			userSurname:  '',
			userPhone:  '',
			comment: '',
			transfer: false,
			transferComment: ''
		}
		bookingFormData.value = JSON.parse(JSON.stringify(defaultArgs))
	} catch (error: H3Error) {
		if (error && error.data) {
			serverErrors.value = [error.data.message];
		} else {
			console.log(error)
		}
	} finally {
		pending.value = false;
	}
}

const goBack = () => {
	listingBookingConfirmModal.value = false;
	setTimeout(() => step.value = 1, 150)
}



</script>

<template>
	<v-dialog v-model="listingBookingConfirmModal" :fullscreen="isMobileOrTablet" max-width="750px">
		<v-card >
			<v-toolbar color="#F0F3F7">
				<v-btn
					:icon="mdiClose"
					@click="listingBookingConfirmModal = false"
				></v-btn>
				<v-toolbar-title>Заявка на бронирование</v-toolbar-title>
			</v-toolbar>
			<v-window v-model="step">
				<v-window-item :value="1">
					<div class="booking">
						<h3 class="mb-4">Информация о бронирование</h3>
						<div class="booking__date">
							<v-card class="booking__input" :ripple="{ class: 'ripple-color' }" @click="openSetDateModal">
								<span class="label">Даты проживания</span>
								<div class="booking__input-body">
									<v-icon :icon="mdiCalendarMonthOutline" color="#333D46"></v-icon>
									<span v-if="!dates.checkIn">Дата</span>
									<span v-else>{{ beautifyDate(dates.checkIn)}} - {{ beautifyDate(dates.checkOut)}}</span>
								</div>
							</v-card>
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
						<div class="room mb-4" v-if="chosenRoom">
							<img :src="chosenRoom.photos[0].urlMin" v-if="chosenRoom.photos" class="room__img"/>
							<div class="room__info">
								<div class="room__name">{{chosenRoom.name}}</div>
								<div class="room__places">{{getWordWithProperEnding(chosenRoom.places, 'место')}}</div>
								<div class="room__params mt-2">
									<span>{{getRoomString(chosenRoom.badCount)}}</span>
									<v-icon :icon="mdiCircleSmall"></v-icon>
									<span>{{chosenRoom.area}} м <sup>2</sup></span>
								</div>
							</div>
						</div>
						<div class="prices" v-if="prices">
							<div class="total">Итоговая сумма:</div>
							<div v-if="authUser && authUser.bonusPoints > 0">
								<v-switch
									v-model="applyBonus"
									label="Списать бонусы"
									color="rgb(112, 89, 255)"
									hide-details
									block
								/>
							</div>
							<div class="price-block">
								<span class="days">За {{formatDays(prices.daysCount)}}</span>
								<div class="price" style="color: #2a2536;" v-if="authUser && authUser.bonusPoints > 0 && applyBonus">
									<span>{{(prices.totalPriceWithBonus).toLocaleString()}} ₽</span>
									<strike style="color: #6a6d81; margin-left: 8px;">{{prices.totalPrice.toLocaleString()}} ₽</strike>
								</div>
								<span class="price" style="color: #2a2536;" v-else>{{prices.totalPrice.toLocaleString()}} ₽</span>
							</div>
							
							<div class="price-block mt-4">
								<span class="days">Предоплата
									<v-icon :icon="mdiHelp"  size="16px" v-tooltip:bottom="'Предоплата 20%.'"></v-icon>
								</span>
								<div class="price" style="color: #2a2536;" v-if="authUser && authUser.bonusPoints > 0 && applyBonus">
									<span>{{(prices.prepayWithBonus).toLocaleString()}} ₽</span>
									<strike style="color: #6a6d81; margin-left: 8px;">{{prices.prepay.toLocaleString()}} ₽</strike>
								</div>
								<span class="price" style="color: #2a2536;" v-else>{{prices.prepay.toLocaleString()}} ₽</span>
							</div>
							<div class="price-block">
								<span class="days">При заселении
										<v-icon :icon="mdiHelp"  size="16px" v-tooltip:bottom="'Оплата принимаеться в наличном или безналичном формате.'"></v-icon>
								</span>
								<div class="price" style="color: #2a2536;" v-if="authUser && authUser.bonusPoints > 0 && applyBonus">
									<span>{{(prices.atCheckInWithBonus).toLocaleString()}} ₽</span>
									<strike style="color: #6a6d81; margin-left: 8px;">{{prices.atCheckIn.toLocaleString()}} ₽</strike>
								</div>
								<span class="price" style="color: #2a2536;" v-else>{{prices.atCheckIn.toLocaleString()}} ₽</span>
							</div>
						</div>
						<h3>Информация о гостях</h3>
						<p>Гость, взрослый, на которого оформляется заявка</p>
						<v-form @submit.prevent="submit" ref="formRef">
							<div class="booking__main-info">
								<v-text-field variant="outlined" required label="Имя" :rules="formRules.name" v-model="bookingFormData.userName"/>
								<v-text-field variant="outlined" required label="Фамилия"  :rules="formRules.surname" v-model="bookingFormData.userSurname"/>
							</div>
							<PhoneInput variant="outlined" class="mb-2" required :rules="formRules.phone" v-model="bookingFormData.userPhone"/>
							
							<v-textarea v-model="bookingFormData.comment" style="height: 150px !important;" variant="outlined" placeholder="Дополнительная информация и Ваши пожелания:" label="Комментарий (Необязательно)"/>
							
							<v-switch color="blue"   label="Нужен ли Вам Трансфер?" v-model="bookingFormData.transfer"/>
							
							<v-textarea v-model="bookingFormData.transferComment" v-show="bookingFormData.transfer"  class="mb-4" variant="outlined"  placeholder="Напишите где вас встречать"/>
							
							
							<div class="booking__btn">
								<v-btn  max-width="500px" width="100%" color="#7059FF" type="submit" :loading="pending">Отправить заявку</v-btn>
							</div>
							<div v-if="serverErrors.length" style="color: red; margin-top: 16px;">
								<ul>
									<li v-for="(error, index) in serverErrors" :key="index">
										{{ error }}
									</li>
								</ul>
							</div>
						</v-form>
					</div>
				</v-window-item>
				<v-window-item :value="2">
					<v-sheet
						max-width="600"
						rounded="lg"
						width="100%"
						class="pa-4 text-center mx-auto"
					>
						<v-icon
							class="mb-5"
							color="success"
							:icon="mdiCheckCircle"
							size="112"
						></v-icon>
						<h2 class="text-h5 mb-4">Заявка успешно отправлена</h2>
						<p class="mb-6 text-medium-emphasis text-body-2">
							Дождитесь пока вам перезвонит владелец жилья, чтобы уточнить данные.
						</p>
						<v-btn color="#7059FF" @click="goBack">Вернуться назад</v-btn>
					</v-sheet>
				</v-window-item>
			</v-window>
		
		</v-card>
	</v-dialog>
</template>

<style scoped lang="scss">

.prices {
	max-width: 320px;
	margin-bottom: 32px;
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


.room {
	display: flex;
	gap: 16px;
	
	&__img {
		height: 100px;
		width: 100px;
		object-fit: cover;
		border-radius: 16px;
	}
	
	&__name {
		font-weight: bold;
		margin-bottom: 8px;
	}
}

.booking {
	
	@media screen and (max-width: 670px) {
		&__main-info {
			display: block !important;
		}
	}
	
	padding: 24px;
	&__date {
		display: flex;
		gap: 16px;
		margin-bottom: 16px;
	}
	@media screen and (max-width: 480px){
		&__date {
			flex-direction: column;
		}
	
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
	&__main-info {
		margin-top: 16px;
		margin-bottom: 8px;
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 16px;
	}
	
	&__btn {
		display: flex;
		justify-content: center;
	}
}

</style>