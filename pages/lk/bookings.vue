<script setup lang="ts">
	import {getStatusColor, getStatusIcon, getStatusText, beautifyDates} from "~/modules/Admin/Booking/utils";
	import {mdiCalendarMonthOutline, mdiMapMarker, mdiPencil, mdiWhatsapp} from "@mdi/js";
	import {useAuthUser} from "~/modules/Auth/composables/useAuthUser";
	import {parsePhoneNumber} from "libphonenumber-js";
	import BtnPrimary from "~/modules/Common/UI/BtnPrimary.vue";
	definePageMeta({
		layout: 'lk',
		middleware: ['auth-user-only']
	})
	
	const authUser = useAuthUser();
	
	const {data: user, refresh} = await useAsyncData('user-full-info', () => $fetch(`/api/users/${authUser.value?.id}/main-info`));
	const deleteConfirmSnackBar = ref(false);
	
	const deleteBooking = async (bookingId: number) => {
		deleteConfirmSnackBar.value = false;
		await $fetch(`/api/bookings/${bookingId}`, {
			method: "DELETE"
		})
	}
	
	const whatsLink = (booking) => `whatsapp://send?phone=${booking.managedBy.phone}&text=Здравствуйте! Расскажите подробнее про: ${booking.listing.title}. https://aura-tour-abkhazia.ru/listing/${booking.listing.id}`

</script>

<template>
	<h2 class="title">
		Мои бронирования
	</h2>
	<div class="booking" v-for="booking of user.userBookings">
		<div class="header">
			<img :src="booking.listing.photo" class="header__img"/>
			<div class="header__info">
				<div class="header__title">
					{{booking.listing.title}}
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
			<div class="booking contacts">
				<div>
					<v-avatar v-if="booking.managedBy.avatar">
						<v-img :src="booking.managedBy.avatar"/>
					</v-avatar>
					<v-avatar v-else color="#7059FF" size="50">{{booking.managedBy.name[0]}}</v-avatar>
				</div>
				
				<div>
					<div class="name">{{booking.managedBy.name}}</div>
					<div class="phone">{{parsePhoneNumber(booking.managedBy.phone).formatNational()}}</div>
					<v-chip class="booking__whats mt-3" variant="flat" :href="whatsLink(booking)" :prepend-icon="mdiWhatsapp" color="#2F9E45">
						Написать в WhatsApp
					</v-chip>
				</div>
			</div>
		</div>
		
	</div>
	

</template>

<style scoped lang="scss">

.contacts {
	display: flex;
	
	gap: 16px;
	margin-left: 24px;
	margin-top: 8px;
	
	.name {
		font-size: 18px;
		font-weight: bold;
		margin-bottom: 4px;
	}
}

.header {
	flex-wrap: wrap;
	display: flex;
	margin-top: 24px;
	gap: 8px;
}

.header__title {
	font-weight: bold;
	font-size: 24px;
	margin-bottom: 4px;
}

.header__img {
	width: 200px;
	height: 150px;
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
	font-size: 16px;
	color: #666;
	display: flex;
	align-items: center;
	margin-top: 8px;
}

@media screen and (max-width: 450px) {
	.header__img {
		width: 120px;
		height: 100px;
		object-fit: cover;
		border-radius: 8px;
	}
}


</style>