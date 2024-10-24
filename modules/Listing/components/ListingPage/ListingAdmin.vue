<script setup lang="ts">
	import useListingBooking from "~/modules/Listing/composables/useListingBooking";
	import type {BookingResponse} from "~/modules/Listing/types/response.types";
	import useBooking from "~/modules/Booking/composables/useBooking";
	import AdminBookingItem from "~/components/pages/Admin/AdminBookingItem.vue";
	import type {BookingCreateDTO} from "~/modules/Listing/types/dto.types";
	import TextEditor from "~/components/pages/Admin/TextEditor.vue";
	import useListing from "~/modules/Listing/composables/useListing";
	
	const { beautifyDate} = useBooking()
	const {listing} = useListing()
	//ts-ignore
	const {data: bookings , error} = await useAsyncData<BookingResponse[]>('bookings', () => $fetch(`/api/booking/${listing.value.id}`))

	
	const bookingCalendar = computed(() => bookings.value ? bookings.value.map(i => ({
		highlight: 'blue',
		dates: [[i.startDate, i.endDate]],
		popover: {
			label: i.phone,
			visibility: 'click'
		}
	})) : [] )
	
	const tab = ref();
	const pending = ref(false);
	
	const formDataDefault = {
		name:  '',
		surname: '',
		phone: '',
		comment: '',
		transfer: false,
		transferComment: '',
		checkIn: '',
		checkOut: '',
		totalPrice: 0,
		prepay: 0,
		adults: 2,
		childrens: 0,
		roomId: 0,
	}
	const snackbar = ref(false)
	
	let bookingFormData = reactive({...formDataDefault})
	
	async function copyToClipboard() {
		try {
			await navigator.clipboard.writeText(window.location.href);
			alert('Ссылка скопирована в буфер обмена');
		} catch (err) {
			console.error('Ошибка при копировании: ', err);
		}
	}
	
	const form = ref()
	
	async function submit() {
	
		const { valid } = await form.value.validate()
		if (!valid) return;
		const dto: BookingCreateDTO = {
			startDate: new Date(bookingFormData.checkIn),
			//@ts-ignore
			endDate: new Date(bookingFormData.checkOut),
			childrens: bookingFormData.childrens,
			adults: bookingFormData.adults,
			listingId: listing.value.id,
			roomId: bookingFormData.roomId,
			userId: null,
			totalPrice: bookingFormData.totalPrice,
			prepay: bookingFormData.prepay,
			name: bookingFormData.name,
			surname: bookingFormData.surname,
			comment: bookingFormData.comment,
			phone: '+7' + bookingFormData.phone,
			transfer: bookingFormData.transfer,
			transferComment: bookingFormData.transferComment
		}
		
		try {
			pending.value = true;
			await useFetch('/api/booking/create', {
				method: 'POST',
				body: dto
			})
			pending.value = false;
			await refreshNuxtData('bookings')
			tab.value = 1;
			bookingFormData = formDataDefault;
		} catch (e) {
			console.log(e)
		}
		
	}
	
	const {isMobile} = useDevice()
	
	async function deleteListing() {
		await useFetch(`/api/listing/${listing.value.id}`, {
			method: 'DELETE'
		})
		alert('Объект удален');
		await navigateTo({
			path: '/search'
		})
	}
	
	const {data: listingNote} = await useFetch(`/api/listing-note/${listing.value.id}`)
	//@ts-ignore
	const noteText = ref(listingNote.value.note ?? '');
	const createNote = () => useFetch(`/api/listing-note/${listing.value.id}`, {
		method: 'POST',
		body: {
			note: noteText.value
		}
	})
	
</script>

<template>
	<div class="listing-block">
		<v-chip-group class="mb-5">
			<v-chip :href="`/admin/edit-listing/${listing.id}`" prepend-icon="mdi-pencil">Редактировать</v-chip>
			<v-chip @click="snackbar = true"  prepend-icon="mdi-delete-forever-outline">Удалить объект</v-chip>
			<v-chip @click="copyToClipboard" prepend-icon="mdi-content-copy">Копировать ссылку</v-chip>
			<v-chip href="/admin/create-listing" prepend-icon="mdi-database-plus">Создать объект</v-chip>
		</v-chip-group>
		
		
		<v-tabs
			v-model="tab"
			align-tabs="center"
			color="deep-purple-accent-4"
		>
			<v-tab :value="1">Заметки</v-tab>
			<v-tab :value="2">Бронирования</v-tab>
			<v-tab :value="3">Создать бронирование</v-tab>
			<v-tab :value="4">Календарь</v-tab>
		</v-tabs>
		<v-window v-model="tab">
			<v-window-item
				:value="1"
			>
				<TextEditor class="mt-4" v-model="noteText"/>
				<v-btn @click="createNote">Сохранить</v-btn>
			</v-window-item>
			<v-window-item
				:value="2"
			>
				<v-alert
					type="info"
					class="mt-4"
					v-if="bookings && bookings.length === 0"
					text="Бронирований пока что не было"
				></v-alert>
				<AdminBookingItem
					v-for="booking of bookings"
					:booking="booking"
				/>
			</v-window-item>
			<v-window-item
				:value="3"
			>
				<h3 class="mt-4">Информация о гостях</h3>
				<p>Гость, взрослый, на которого оформляется заявка</p>
				
				<v-form @submit.prevent="submit" ref="form" class="mt-4">
					<div class="booking__main-info">
						<v-text-field  required label="Фамилия"  :rules="[(v: string) => !!v || 'Введите фамилию']" v-model="bookingFormData.surname"/>
						<v-text-field  label="Имя"  v-model="bookingFormData.name"/>
					</div>
					<PhoneInput  class="mb-2" required :rules="[(v: string) => !!v || 'Введите номер']" v-model="bookingFormData.phone"/>
					<v-textarea v-model="bookingFormData.comment" style="height: 150px !important;" variant="outlined" placeholder="Дополнительная информация" label="Комментарий (Необязательно)"/>
					<div style="display: flex; margin-top: 24px; gap: 16px">
						<v-text-field type="date" required label="Дата заезда" v-model="bookingFormData.checkIn"></v-text-field>
						<v-text-field type="date" required label="Дата выезда" v-model="bookingFormData.checkOut"></v-text-field>
					</div>
					<div style="display: flex; margin-top: 24px; gap: 16px">
						<v-text-field type="number" required label="Количество взрослых" v-model.number="bookingFormData.adults"></v-text-field>
						<v-text-field type="number" required label="Количество детей" v-model.number="bookingFormData.childrens"></v-text-field>
					</div>
					<v-text-field type="number" required label="Итоговая цена" v-model.number="bookingFormData.totalPrice"></v-text-field>
					<v-text-field type="number" required label="Предоплата" v-model.number="bookingFormData.prepay"></v-text-field>
				
					<v-switch  color="blue"  label="Нужен ли Трансфер?" v-model="bookingFormData.transfer"/>
					
					<v-textarea v-model="bookingFormData.transferComment" v-if="bookingFormData.transfer"  class="mb-4" hide-details variant="outlined"  placeholder="Комментарий к трансферу"/>
					<v-select
						v-if="listing.rooms.length > 0"
						v-model="bookingFormData.roomId"
						:items="listing.rooms"
						item-title="name"
						item-value="id"
						class="mb-4"
					/>
					
					<div class="booking__btn">
						<v-btn  max-width="500px" width="100%" color="#7059FF" type="submit" :loading="pending">Создать</v-btn>
					</div>
				</v-form>
			</v-window-item>
			<v-window-item :value="4">
				<Calendar :expanded="isMobile" class="mt-4 calendar" :attributes="bookingCalendar" :columns="!isMobile ? 2 : 1"/>
			</v-window-item>
		</v-window>
	</div>
	<v-snackbar
		v-model="snackbar"
		multi-line
	>
		Точно хотите удалить?
		
		<template v-slot:actions>
			<v-btn
				color="red"
				variant="text"
				class="mr-5"
				@click="deleteListing"
			>
				Да
			</v-btn>
			<v-btn
				variant="text"
				@click="snackbar = false"
			>
				Нет
			</v-btn>
		</template>
	</v-snackbar>
</template>

<style scoped lang="scss">


.btns {
	display: flex;
	flex-wrap: wrap;
	gap: 8px;
	margin-bottom: 8px;
	@media screen and (max-width: 700px) {
		button, a {
			width: 100% !important;
		}
	}
}

</style>