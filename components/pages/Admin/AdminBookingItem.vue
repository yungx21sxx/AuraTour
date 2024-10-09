<script setup lang="ts">

	import type {BookingResponse} from "~/types/response.types";
	import useBooking from "~/components/Booking/useBooking";
	
	defineProps<{
		booking: BookingResponse
	}>();
	
	const {beautifyDate} = useBooking()
	const describeGroup = (booking: BookingResponse) => {
		
		const { adults, childrens } = booking
		function pluralize(n: number, forms: [string, string, string]): string {
			if (n % 10 === 1 && n % 100 !== 11) {
				return forms[0];
			} else if (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20)) {
				return forms[1];
			} else {
				return forms[2];
			}
		}
		
		const adultsStr = `${adults} ${pluralize(adults, ['взрослый', 'взрослых', 'взрослых'])}`;
		const childrenStr = childrens > 0 ? `, ${childrens} ${pluralize(childrens, ['ребенок', 'ребенка', 'детей'])}` : '';
		
		return `${adultsStr}${childrenStr}`;
	}
	
	const showInfo = ref(false)
</script>

<template>
	<v-card
		class="mt-4"
		prepend-icon="mdi-alert-circle-outline"
	>
		<template #title>{{booking.listing.title}}</template>
		<template #append>
			<v-btn icon="mdi-open-in-new" :href="`/listing/${booking.listingId}`" target="_blank"/>
		</template>
		<v-card-item style="margin-top: -8px;">
			<div class="listing-chips">
				<v-chip>с {{beautifyDate(booking.startDate)}} по {{beautifyDate(booking.endDate)}}</v-chip>
				<v-chip>{{describeGroup(booking)}}</v-chip>
				<v-chip color="blue" @click="showInfo = !showInfo">Подробнее</v-chip>
			</div>
			<div v-if="showInfo" class="mt-4">
				<p class="mt-2" v-if="booking.comment"><strong>Бронь на: </strong>{{booking.name}} {{booking.surname}}</p>
				<div class="mt-2"><strong>Телефон: </strong><NuxtLink :to="'+7' + booking.phone">+7 {{booking.phone}}</NuxtLink></div>
				<p class="mt-2" v-if="booking.comment"><strong>Комментарий: </strong>{{booking.comment}}</p>
				<p class="mt-2" v-if="booking.room"><strong>Номер: </strong>{{booking.room.name}}</p>
				<v-chip class="mt-2" v-if="booking.transfer" prepend-icon="mdi-car">Нужен трансфер</v-chip>
				<p class="mt-2" v-if="booking.transfer"><strong>Комментарий: </strong>{{booking.transferComment}}</p>
			</div>
			
		</v-card-item>
	
	</v-card>

</template>

<style scoped lang="scss">

</style>