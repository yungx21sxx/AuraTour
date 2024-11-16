<script setup lang="ts">
	import {ListingBookingApi} from "~/modules/Admin/Listing/api/listingBookingApi";
	import useListing from "~/modules/Listing/composables/useListing";
	import useBooking from "~/modules/Booking/composables/useBooking";
	import {mdiCalendarMonthOutline, mdiClockOutline, mdiCheckCircle, mdiCancel, mdiCheckCircleOutline, mdiHelpCircle, mdiPencil} from '@mdi/js'
	import BtnPrimary from "~/modules/Common/UI/BtnPrimary.vue";
	import BtnSecondary from "~/modules/Common/UI/BtnSecondary.vue";
	import BookingCreateOrUpdateModal from "~/modules/Admin/Listing/components/BookingCreateOrUpdateModal.vue";
	import type {ListingBookingItemAdminResponse} from "~/modules/Admin/Listing/types/response.types";
	import BookingCalendarModal from "~/modules/Admin/Listing/components/BookingCalendarModal.vue";
	
	const {listing} = useListing();
	
	defineProps<{
		bookings: ListingBookingItemAdminResponse[]
	}>()
	
	import {useAuthUser} from "~/modules/Auth/composables/useAuthUser";
	
	const authUser = useAuthUser();
	
	const access = computed(() => {
		const fullAccess = authUser.value && ['ADMIN', 'MANAGER'].includes(authUser.value.role);
		const isListingOwner = authUser.value && (listing.value.owner && authUser.value.id === listing.value.owner.id);
		
		return {
			fullAccess,
			isListingOwner
		}
	})
	
	const {isMobile} = useDevice()
	
	const bookingCalendar = ref(false);
	
	const {beautifyDate, describedGroup} = useBooking();
	
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
	
	const bookingCreateOrUpdateModalOpen = ref(false);
	
	const bookingToUpdate = ref<ListingBookingItemAdminResponse | null>(null)
	
	const createBooking = () => {
		bookingToUpdate.value = null;
		bookingCreateOrUpdateModalOpen.value = true
	}
	
	const updateBooking = (booking: ListingBookingItemAdminResponse) => {
		bookingToUpdate.value = booking;
		bookingCreateOrUpdateModalOpen.value = true
	}
	
	const onSaveHandler = async () => {
		bookingCreateOrUpdateModalOpen.value = false;
		await refreshNuxtData('listing-bookings');
	}
	
	const deleteConfirmSnackBar = ref(false);
	
	const deleteBooking = async (bookingId: number) => {
		deleteConfirmSnackBar.value = false;
		await $fetch(`/api/bookings/${bookingId}`, {
			method: "DELETE"
		})
		await refreshNuxtData('listing-bookings');
	}
	
</script>

<template>
	<BookingCreateOrUpdateModal
		v-model:is-open="bookingCreateOrUpdateModalOpen"
		:booking-to-update="bookingToUpdate"
		@onSave="onSaveHandler"
	/>
	<BookingCalendarModal :bookings="bookings" v-model:is-open="bookingCalendar"/>
	<div class="mt-8">
		<div v-if="access.fullAccess">
			<BtnPrimary :block="isMobile" class="mb-4 text-center" @click="createBooking">Создать бронирование</BtnPrimary>
			<BtnSecondary :block="isMobile" class="mb-4 text-center" :prepend-icon="mdiCalendarMonthOutline" @click="bookingCalendar = true">Открыть календарь</BtnSecondary>
		</div>
		<h2 v-if="bookings.length === 0" class="text-center">
			Бронированний пока нет.
		</h2>
		<v-expansion-panels v-else>
			<v-expansion-panel
				v-for="booking of bookings"
				:key="booking.id"
			>
				<template #title>
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
				</template>
				<template #text>
					<!-- Дополнительная информация -->
					<div class="details">
						<div class="details__item">
							<strong>Дата создания:</strong> {{ beautifyDate( booking.createdAt ) }}
						</div>
						<div class="details__item" v-if="booking.room">
							<strong>Выбранный номер:</strong> {{ booking.room ? booking.room.name : 'Не указано' }}
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
							<BtnPrimary v-if="access.fullAccess" :href="`/admin/user/${booking.user.id}`" class="mt-4 mb-4">Профиль пользователя</BtnPrimary>
						</div>
						<v-divider></v-divider>
						<BtnSecondary v-if="access.fullAccess" class="mt-4" :prepend-icon="mdiPencil" @click="updateBooking(booking)">Редактировать</BtnSecondary>
						<v-btn variant="elevated" v-if="access.fullAccess" color="red" class="mt-4" :prepend-icon="mdiPencil" @click="deleteConfirmSnackBar = true">Удалить</v-btn>
						
						<v-snackbar
							v-model="deleteConfirmSnackBar"
							multi-line
						>
							Точно хотите удалить?
							
							<template v-slot:actions>
								<v-btn
									color="red"
									variant="text"
									class="mr-5"
									@click="deleteBooking(booking.id)"
								>
									Да
								</v-btn>
								<v-btn
									variant="text"
									@click="deleteConfirmSnackBar = false"
								>
									Нет
								</v-btn>
							</template>
						</v-snackbar>
					</div>
				</template>
			</v-expansion-panel>
		</v-expansion-panels>
	
	</div>
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