<script setup lang="ts">

import useBooking from "~/modules/Booking/composables/useBooking";
import useSearch from "~/modules/Booking/composables/useSearch";
import { mdiMagnify } from '@mdi/js'
import { mdiCalendarMonthOutline } from '@mdi/js';
import { mdiAccountOutline } from '@mdi/js';
import { mdiMinus, mdiPlus } from '@mdi/js';
import { mdiArrowRightCircleOutline } from '@mdi/js';
import BookingSearchLocation from "~/modules/Booking/components/BookingSearchLocation.vue";
import BookingSetDate from "~/modules/Booking/components/BookingSetDate.vue";

const {
	peopleCount,
	bookingModals,
	describedGroup,
	openLocationModal,
	openSetDateModal,
	beautifyDate,
	goToCatalog,
} = useBooking();

const { chosenCity } = useSearch()

const emit = defineEmits(['submit'])


const dates = computed(() => {
	const {from, to} = bookingModals.value.date
	return {from, to}
})

const guestSetMenuIsOpen = ref(false);

const dateInputError = ref(false)
const locationInputError = ref(false)



async function onSubmit() {
	emit('submit')
	await goToCatalog()
}



</script>

<template>
	<div class="booking">
		<v-card class="booking__input booking__input_first booking__location" :ripple="{ class: 'ripple-color' }"  @click="openLocationModal">
			<v-icon :icon="mdiMagnify"/>
			<span v-if="!chosenCity">Выберите курорт</span>
			<div v-else>
				<span>{{chosenCity.cityName}}</span>
			</div>
		</v-card>
		<div :class="['booking__date', {
			'error': dateInputError
		}]">
			<v-card class="booking__input" :ripple="{ class: 'ripple-color' }"  @click="openSetDateModal">
				<v-icon :icon="mdiCalendarMonthOutline"/>
				<span v-if="!dates.from">Заезд</span>
				<span v-else>{{beautifyDate(dates.from)}}</span>
			</v-card>
			<v-card class="booking__input" :ripple="{ class: 'ripple-color' }"  @click="openSetDateModal">
				<v-icon :icon="mdiCalendarMonthOutline"/>
				<span v-if="!dates.to">Выезд</span>
				<span v-else>{{beautifyDate(dates.to)}}</span>
			</v-card>
		</div>
		<v-menu :close-on-content-click="false" v-model="guestSetMenuIsOpen">
			<template v-slot:activator="{ props }">
				<v-card class="booking__input booking__input_people"  v-bind="props" :ripple="{ class: 'ripple-color' }">
					<v-icon :icon="mdiAccountOutline"/>
					<span>{{ describedGroup }}</span>
				</v-card>
			</template>
			<v-card >
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
							<v-btn :icon="mdiMinus" density="comfortable" variant="tonal" color="#7059FF" @click="peopleCount.adults -= 1" :disabled="peopleCount.adults === 1"/>
							<strong class="amount__output">{{ peopleCount.adults }}</strong>
							<v-btn :icon="mdiPlus" density="comfortable" variant="tonal" color="#7059FF" @click="peopleCount.adults += 1"/>
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
							<v-btn :icon="mdiMinus" density="comfortable" variant="tonal" color="#7059FF" @click="peopleCount.children -= 1" :disabled="peopleCount.children === 0"/>
							<strong class="amount__output">{{ peopleCount.children }}</strong>
							<v-btn :icon="mdiPlus" density="comfortable" variant="tonal" color="#7059FF" @click="peopleCount.children += 1"/>
						</div>
					
					</div>
					<v-btn color="#7059FF"  width="100%" @click="guestSetMenuIsOpen = false">Готово</v-btn>
				</v-card-item>
			</v-card>
		</v-menu>
		<div class="booking__submit">
			<v-btn :append-icon="mdiArrowRightCircleOutline" width="100%" class="booking__submit_btn"  color="#7059FF"   @click="onSubmit">Найти жилье</v-btn>
		</div>
		
	</div>
	
	<BookingSearchLocation/>
	<BookingSetDate/>
</template>

<style scoped lang="scss">
.amount {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 16px;
	background: #FFFFFF;
	&__info  {
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
		position: relative;
		//box-shadow: 5px 5px 12px rgba(0,0,0,.07);
		border: 1px solid $light-gray;
		@media screen and (max-width: 890px) {
			grid-template-columns: .7fr 1fr 1fr 140px;
			
			.location-region {
				display: none;
			}
		}
		@media screen and (max-width: 750px) {
			display: block;
			padding-right: 0 !important;
			&__input::before {
				background: none !important;
				width: 0 !important;
			}
			
			&__date > &__input:last-child::after {
				background: #b2b2b2;
				bottom: 15px;
				content: "";
				left: -1px;
				position: absolute;
				top: 15px;
				transition: opacity .2s ease;
				width: 2px;
			}
			
			&__input {
				border-bottom: 1px solid rgba(178, 178, 178, 0.71);
				
				&_people {
					border-bottom: none;
				}
			}
			
			&__submit_btn {
				height: 45px;
			}
			
			&__submit {
				padding: 0 16px 16px;
			}
			
			
			
		}
		
		display: grid;
		grid-template-columns: 270px 1fr .7fr 170px;
		align-items: center;
		//margin-top: 32px;
		background: rgba(255, 255, 255, 0.90);
		border-radius: 10px;
		padding-right: 16px;
		
		&__date {
			display: flex;
			width: 100%;
			
			&.error .booking__input {
				color: #ff7878;
			}
		}
		
		
		
		
		&__input {
			background: rgba(255, 255, 255, 0) !important;
			padding-left: 16px;
			width: 100%;
			display: flex;
			gap: 8px;
			align-items: center;
			height: 65px;
			border-radius: 0;
			box-shadow: none;
			
			&.error span {
				color: #ff7878;
			}
			
			&:not(&_first)::before {
				background: $light-gray;
				bottom: 15px;
				content: "";
				left: -1px;
				position: absolute;
				top: 15px;
				transition: opacity .2s ease;
				width: 2px;
			}
		}
	}


</style>