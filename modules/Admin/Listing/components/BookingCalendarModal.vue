<script setup lang="ts">
	import type {ListingBookingItemAdminResponse} from "~/modules/Admin/Listing/types/response.types";
	import {Calendar} from "v-calendar";
	import useBooking from "~/modules/Booking/composables/useBooking";
	import BtnPrimary from "~/modules/Common/UI/BtnPrimary.vue";
	import BtnSecondary from "~/modules/Common/UI/BtnSecondary.vue";
	import {
		mdiCalendarMonthOutline,
		mdiClockOutline,
		mdiCheckCircle,
		mdiCancel,
		mdiCheckCircleOutline,
		mdiHelpCircle,
		mdiPencil,
		mdiClose
	} from '@mdi/js';
	
	const isOpen = defineModel<boolean>('isOpen');
	
	const {bookings} = defineProps<{
		bookings: ListingBookingItemAdminResponse[]
	}>()
	const {isMobile} = useDevice();
	const {beautifyDate, describedGroup} = useBooking();
	
	const bookingCalendar = computed(() => bookings ? bookings.map(i => ({
		highlight: getStatusColor(i.status),
		dates: [[i.checkIn, i.checkOut]],
		popover: true,
		bookingData: i,
	})) : [] )
	
	const booking = ref<ListingBookingItemAdminResponse | null>(null);
	const bookingDetailsModal = ref(false);
	
	function openBookingDetails(selectedBooking: ListingBookingItemAdminResponse) {
		booking.value = selectedBooking;
		bookingDetailsModal.value = true;
	}
	
	function getStatusText(status: string) {
		switch (status) {
			case 'PENDING':
				return 'В ожидании';
			case 'CONFIRMED':
				return 'Подтверждено';
			case 'CANCELLED':
				return 'Отменено';
			case 'COMPLETED':
				return 'Завершено';
			default:
				return 'Неизвестно';
		}
	}
	
	function getStatusIcon(status: string) {
		switch (status) {
			case 'PENDING':
				return mdiClockOutline;
			case 'CONFIRMED':
				return mdiCheckCircleOutline;
			case 'CANCELLED':
				return mdiCancel;
			case 'COMPLETED':
				return mdiCheckCircle;
			default:
				return mdiHelpCircle;
		}
	}
	
	function getStatusColor(status: string) {
		switch (status) {
			case 'PENDING':
				return 'orange';
			case 'CONFIRMED':
				return 'green';
			case 'CANCELLED':
				return 'red';
			case 'COMPLETED':
				return 'blue';
			default:
				return 'grey';
		}
	}
	
</script>

<template>
	<v-dialog v-model="isOpen" max-width="700px" :fullscreen="isMobile">
		<v-card>
			<v-toolbar>
				<v-btn :icon="mdiClose" @click="isOpen = false"></v-btn>
				<v-toolbar-title>Календарь бронирований</v-toolbar-title>
			</v-toolbar>
			<v-card-item>
				<Calendar
					class="mt-4 calendar"
					:attributes="bookingCalendar"
					expanded
					:rows="isMobile ? 12 : 1"
					:columns="isMobile ? 1 : 2"
				>
					<template #day-popover="{ attributes }">
						<div>
							<div class="popover-content" style="padding: 8px">
								<div class="header" style="padding: 8px">
									<v-avatar color="#7059FF">
										{{ attributes[0].bookingData.userName.charAt(0) }}
									</v-avatar>
									<div class="header__info">
										<div class="header__name">
											{{ attributes[0].bookingData.userName }} {{ attributes[0].bookingData.userSurname }}
										</div>
										<div class="header__dates">
											<v-icon small class="mr-1" :icon="mdiCalendarMonthOutline"></v-icon>
											{{ beautifyDate(attributes[0].bookingData.checkIn) }} - {{ beautifyDate(attributes[0].bookingData.checkOut) }}
										</div>
										<div class="header__status">
											<v-chip
												:prepend-icon="getStatusIcon(attributes[0].bookingData.status)"
												:color="getStatusColor(attributes[0].bookingData.status)"
											>{{ getStatusText(attributes[0].bookingData.status) }}</v-chip>
										</div>
									</div>
									
								</div>
								<v-btn block color="primary" @click="openBookingDetails(attributes[0].bookingData)">
									Подробнее
								</v-btn>
							</div>
						</div>
					</template>
				</Calendar>
			</v-card-item>
			
		</v-card>
	
	</v-dialog>
	<v-dialog v-model="bookingDetailsModal" max-width="600px" :fullscreen="isMobile">
		<v-card>
			<v-toolbar>
				<v-btn :icon="mdiClose" @click="bookingDetailsModal = false"/>
				<v-toolbar-title>Детали бронирования</v-toolbar-title>
			</v-toolbar>
			<v-card-text v-if="booking">
				<div class="header">
					<v-avatar color="#7059FF">
						{{ booking.userName.charAt(0) }}
					</v-avatar>
					<div class="header__info">
						<div class="header__name">
							{{ booking.userName }} {{ booking.userSurname }}
						</div>
						<div class="header__dates">
							<v-icon small class="mr-1" :icon="mdiCalendarMonthOutline"></v-icon>
							{{ beautifyDate(booking.checkIn) }} - {{ beautifyDate(booking.checkOut) }}
						</div>
						<div class="header__status">
							<v-chip
								:prepend-icon="getStatusIcon(booking.status)"
								:color="getStatusColor(booking.status)"
							>{{ getStatusText(booking.status) }}</v-chip>
						</div>
					</div>
				</div>
				<div class="details">
					<div class="details__item">
						<strong>Номер:</strong> {{ booking.room ? booking.room.name : 'Не указано' }}
					</div>
					<div class="details__item">
						<strong>Телефон:</strong> {{ booking.userPhone }}
					</div>
					<div class="details__item" v-if="booking.childrens > 0">
						<strong>Дети:</strong> {{ booking.childrens }}
					</div>
					<div class="details__item" v-if="booking.comment">
						<strong>Комментарий:</strong> {{ booking.comment }}
					</div>
					<div class="details__item" v-if="booking.transfer">
						<strong>Трансфер:</strong> Да
						<div v-if="booking.transferComment">
							<strong>Комментарий к трансферу:</strong> {{ booking.transferComment }}
						</div>
					</div>
					<div class="details__item">
						<strong>Количество ночей:</strong> {{ booking.daysCount }}
					</div>
					<div class="details__item details__item_bonus" v-if="booking.bonusApplied">
						<strong>Общая цена:</strong> <span>{{booking.totalPriceWithBonus}} руб.</span><strike>{{ booking.totalPrice }} руб.</strike>
					</div>
					<div class="details__item" v-else>
						<strong>Общая цена:</strong> {{ booking.totalPrice }} руб.
					</div>
					<div class="details__item details__item_bonus" v-if="booking.bonusApplied">
						<strong>Предоплата:</strong> <span>{{booking.prepayWithBonus}} руб.</span><strike>{{ booking.prepay }}  руб.</strike>
					</div>
					<div class="details__item" v-else>
						<strong>Предоплата:</strong> {{ booking.prepay }} руб.
					</div>
					<div class="details__item" v-if="booking.bonusApplied">
						<strong>Использовано бонусов:</strong> {{ booking.bonusAppliedCount }}
					</div>
					<!-- Информация о пользователе -->
					<div class="details__user" v-if="booking.user">
						<v-divider class="my-4"></v-divider>
						<h3>Информация о пользователе</h3>
						<div class="details__item">
							<strong>Пользователь:</strong> {{ booking.user.name }} {{ booking.user.surname }}
						</div>
						<div class="details__item">
							<strong>Email:</strong> {{ booking.user.email }}
						</div>
						<div class="details__item">
							<strong>Телефон:</strong> {{ booking.user.phone }}
						</div>
						<div class="details__item">
							<strong>Бонусные баллы:</strong> {{ booking.user.bonusPoints }}
						</div>
					</div>
<!--					<BtnSecondary :prepend-icon="mdiPencil" @click="updateBooking(booking)">Редактировать</BtnSecondary>-->
<!--					<BtnSecondary :prepend-icon="mdiPencil">Удалить</BtnSecondary>-->
				</div>
			</v-card-text>
		</v-card>
	</v-dialog>
</template>

<style scoped lang="scss">
.header {
	display: flex;
	align-items: center;
}

.header__info {
	margin-left: 16px;
}

.header__name {
	font-weight: bold;
	font-size: 18px;
}

.header__dates,
.header__status {
	font-size: 14px;
	color: #666;
	display: flex;
	align-items: center;
	margin-top: 8px;
}

.details {
	margin-top: 16px;
}

.details__item {
	margin-bottom: 8px;
	> * {
		margin-right:  8px;
	}
}

.details__user h3 {
	margin-bottom: 12px;
}

</style>