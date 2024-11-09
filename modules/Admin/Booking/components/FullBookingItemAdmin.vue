<script setup lang="ts">

import {mdiCalendarMonthOutline, mdiMapMarker, mdiPencil} from "@mdi/js";
import BtnPrimary from "~/modules/Common/UI/BtnPrimary.vue";
import BtnSecondary from "~/modules/Common/UI/BtnSecondary.vue";
import {type BookingItemWithListingAdminResponse} from "~/modules/Admin/Booking/types/response.types";
import {getStatusColor, getStatusIcon, getStatusText, beautifyDates} from "~/modules/Admin/Booking/utils";
import BookingCreateOrUpdateModal from "~/modules/Admin/Listing/components/BookingCreateOrUpdateModal.vue";
import type {ListingBookingItemAdminResponse} from "~/modules/Admin/Listing/types/response.types";
import BookingEditModal from "~/modules/Admin/Booking/components/BookingEditModal.vue";

const {booking} = defineProps<{
	booking: BookingItemWithListingAdminResponse
}>();

const emit = defineEmits<{
	(e: 'onUpdate'): void;
}>();

const deleteConfirmSnackBar = ref(false);

const deleteBooking = async (bookingId: number) => {
	deleteConfirmSnackBar.value = false;
	await $fetch(`/api/bookings/${bookingId}`, {
		method: "DELETE"
	})
	emit('onUpdate');
}

const bookingCreateOrUpdateModalOpen = ref(false);
const bookingToUpdate = ref<BookingItemWithListingAdminResponse>(booking)

const updateBooking = (booking: BookingItemWithListingAdminResponse) => {
	bookingToUpdate.value = booking;
	bookingCreateOrUpdateModalOpen.value = true
}

const onSaveHandler = async () => {
	bookingCreateOrUpdateModalOpen.value = false;
	emit('onUpdate')
}

</script>

<template>
		<BookingEditModal
			v-model:is-open="bookingCreateOrUpdateModalOpen"
			:booking-to-update="bookingToUpdate"
			@onSave="onSaveHandler"
		/>
		<v-expansion-panel
			:key="booking.id"
		>
			<template #title>
				<div class="header">
					<img :src="booking.listing.photo" class="header__img"/>
					<div class="header__info">
						<div class="header__title">
							{{booking.listing.title}}
						</div>
						<div class="header__dates">
							<v-icon small class="mr-1" :icon="mdiMapMarker"></v-icon>
							{{ booking.listing.city }}, {{ booking.listing.address }}
						</div>
						<div class="header__dates">
							<v-icon small class="mr-1" :icon="mdiCalendarMonthOutline"></v-icon>
							{{ beautifyDates(booking.checkIn) }} - {{ beautifyDates(booking.checkOut) }}
						</div>
						<p class="header__dates">Cоздано: {{beautifyDates(booking.createdAt)}}</p>
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
				<div class="details">
					<div class="details__item" v-if="!booking.user">
						<strong>Пользователь:</strong> {{ booking.userName }} {{ booking.userName }}
					</div>
					<div class="details__item">
						<strong>Телефон:</strong> {{ booking.userPhone }}
					</div>
					<div class="details__item" v-if="booking.room">
						<strong>Номер:</strong> {{ booking.room ? booking.room.name : 'Не указано' }}
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
					<div class="details__item">
						<strong>Менеджер:</strong> {{ booking.managedBy.name }}
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
						<BtnPrimary class="mt-4 mb-4" :href="`/admin/user/${booking.user.id}`">Профиль пользователя</BtnPrimary>
						<BtnSecondary class="mt-4 mb-4" :href="`/listing/${booking.listing.id}`">Страница объекта</BtnSecondary>
					</div>
					<v-divider></v-divider>
					<BtnSecondary class="mt-4" :prepend-icon="mdiPencil" @click="updateBooking(booking)">Редактировать</BtnSecondary>
					<v-btn variant="elevated" color="red" class="mt-4" :prepend-icon="mdiPencil" @click="deleteConfirmSnackBar = true">Удалить</v-btn>
					
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
</template>

<style scoped lang="scss">

.header {
	display: flex;
	align-items: center;
}

.header__title {
	font-weight: bold;
	margin-bottom: 4px;
}

.header__img {
	width: 100px;
	height: 100px;
	object-fit: cover;
	border-radius: 8px;
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
	font-size: 13px;
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