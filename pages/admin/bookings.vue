<script setup lang="ts">


	import type {BookingResponse} from "~/types/response.types";
	import useBooking from "~/components/Booking/useBooking";
	import AdminBookingItem from "~/components/pages/Admin/AdminBookingItem.vue";
	
	definePageMeta({
		layout: 'admin',
		middleware: ['admin-only'],
	})
	
	const {beautifyDate} = useBooking();
	const {data: bookings , error} = await useFetch<BookingResponse[]>('/api/booking/all')
	const headers = [
		{ text: 'ID', value: 'id' },
		{ text: 'Имя', value: 'name' },
		{ text: 'Фамилия', value: 'surname' },
		{ text: 'Телефон', value: 'phone' },
		{ text: 'Дата начала', value: 'startDate' },
		{ text: 'Дата окончания', value: 'endDate' },
		{ text: 'Взрослые', value: 'adults' },
		{ text: 'Дети', value: 'childrens' },
		{ text: 'Трансфер', value: 'transfer' },
	]

</script>

<template>
	<h1 class="mt-4 mb-4">Все бронирования</h1>
	<AdminBookingItem
		v-for="booking of bookings"
		:booking="booking"
	/>
</template>

<style scoped lang="scss">

</style>