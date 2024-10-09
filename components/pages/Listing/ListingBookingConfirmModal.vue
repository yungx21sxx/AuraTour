<script setup lang="ts">
	import useListingBooking from "~/components/pages/Listing/ListingBooking/useListingBooking";
	import useListing from "~/components/pages/Listing/useListing";
	import useBooking from "~/components/Booking/useBooking";
	import type {BookingCreateDTO} from "~/types/dto.types";
	import useTelegram from "~/composables/UseTelegram";
	
	const {listingBookingConfirmModal, dateModal, getListingQueryLinkParameters} = useListingBooking();
	const {beautifyDate, describedGroup} = useBooking()
	const {listing, listingModalMobile, chosenRoomId, chosenRoom} = useListing();
	const {sendBookingInfo} = useTelegram()
	const {isMobileOrTablet} = useDevice();
	const route = useRoute();
	const pending = ref(false);
	
	const authUser = useAuthUser();
	
	const dates = computed(() => {
		//@ts-ignore
		const {from, to} = dateModal.value
		return {from, to}
	});
	
	let bookingFormData = ref({
		name: authUser.value?.name || '',
		surname: authUser.value?.surname || '',
		phone: authUser.value?.phone?.replace('+7 ', '') || '',
		comment: '',
		transfer: false,
		transferComment: ''
	})
	const form = ref();
	const step = ref(1);
	async function submit() {
		pending.value = true;
		const { valid } = await form.value.validate()
		if (!valid) {
			pending.value = false;
			return;
		}
		const dto: BookingCreateDTO = {
			//@ts-ignore
			startDate: new Date(getListingQueryLinkParameters.value.checkIn),
			//@ts-ignore
			endDate: new Date(getListingQueryLinkParameters.value.checkOut),
			childrens: getListingQueryLinkParameters.value.children,
			adults: getListingQueryLinkParameters.value.adults,
			...bookingFormData.value,
			listingId: listing.value.id,
			roomId: chosenRoomId.value || null,
			userId: authUser.value?.id || null,
			totalPrice: listing.value.totalPrice,
			prepay: Math.trunc(listing.value.totalPrice * 0.15)
		}
		try {
			await Promise.all([
				sendBookingInfo(
					dto,
					`https://aura-tour-abkhazia.ru/listing/${listing.value.id}`,
					chosenRoom.value?.name || null
				),
				$fetch('/api/booking/create', {
					method: 'POST',
					body: dto
				})
			])
			pending.value = false;
			step.value = 2;
			const defaultArgs = {
				name: '',
				surname:  '',
				phone:  '',
				comment: '',
				transfer: false,
				transferComment: ''
			}
			bookingFormData.value = JSON.parse(JSON.stringify(defaultArgs))
		} catch (e) {
			console.log(e)
		}
	}

	const goBack = () => {
		listingModalMobile.value = false;
		listingBookingConfirmModal.value = false;
		setTimeout(() => step.value = 1, 150)
	}
	
	

</script>

<template>
	<v-dialog v-model="listingBookingConfirmModal" :fullscreen="isMobileOrTablet" max-width="700px">
		<v-card >
			<v-toolbar color="#F0F3F7">
				<v-btn
					icon="mdi-close"
					@click="listingBookingConfirmModal = false"
				></v-btn>
				
				<v-toolbar-title>Заявка на бронирование</v-toolbar-title>
			</v-toolbar>
			<v-window v-model="step">
				<v-window-item :value="1">
					<div class="booking">
						<h3>Информация о гостях</h3>
						<p>Гость, взрослый, на которого оформляется заявка</p>
						
						<v-form @submit.prevent="submit" ref="form">
							<div class="booking__main-info">
								<v-text-field  required label="Фамилия"  :rules="[(v: string) => !!v || 'Введите фамилию']" v-model="bookingFormData.surname"/>
								<v-text-field  required label="Имя" :rules="[(v: string) => !!v || 'Введите имя']" v-model="bookingFormData.name"/>
							</div>
							<PhoneInput  class="mb-2" required :rules="[(v: string) => !!v || 'Введите номер']" v-model="bookingFormData.phone"/>
							<v-textarea v-model="bookingFormData.comment" style="height: 150px !important;" variant="outlined" placeholder="Дополнительная информация и Ваши пожелания:" label="Комментарий (Необязательно)"/>
							
							<v-switch color="blue"   label="Нужен ли Вам Трансфер?" v-model="bookingFormData.transfer"/>
							
							<v-textarea v-model="bookingFormData.transferComment" v-show="bookingFormData.transfer"  class="mb-4" variant="outlined"  placeholder="Напишите где вас встречать"/>
							
							
							<div class="booking__btn">
								<v-btn  max-width="500px" width="100%" color="#7059FF" type="submit" :loading="pending">Отправить заявку</v-btn>
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
							icon="mdi-check-circle"
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

	.booking {
		
		@media screen and (max-width: 670px) {
			&__main-info {
				display: block !important;
			}
		}
		
		padding: 24px;
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
		
		&__date {
			display: flex;
			gap: 16px;
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