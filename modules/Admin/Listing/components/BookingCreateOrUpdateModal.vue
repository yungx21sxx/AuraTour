<template>
	<v-dialog v-model="isOpen" max-width="600px" :fullscreen="isMobile">
		<v-card>
			<v-toolbar>
				<v-btn  @click="closeDialog" :icon="mdiClose"/>
				<span class="text-h6">
		          {{ bookingToUpdate ? 'Обновить бронирование' : 'Создать бронирование' }}
		        </span>
			</v-toolbar>
			<v-card-text>
				<v-form ref="formRef" v-model="isFormValid">
					<div>
						<BtnPrimary block :prepend-icon="mdiMagnify" @click="openUserSearchDialog" class="mb-4">{{chosenUserId ? 'Обновить пользователя' : 'Найти пользователя'}}</BtnPrimary>
						<p class="mt-4 mb-4">Перед тем как вводить данные пользователя, попробуйте найти его в базе данных.</p>
					</div>
					<UserSearchDialog
						v-model:isOpen="isUserSearchDialogOpen"
						@onUserSelect="handleUserSelect"
					/>
					<!-- Имя пользователя -->
					<v-text-field
						label="Имя"
						v-model="formData.userName"
						:rules="[rules.required, rules.minLength(2)]"
						required
					></v-text-field>
					
					<!-- Фамилия пользователя -->
					<v-text-field
						label="Фамилия"
						v-model="formData.userSurname"
					></v-text-field>
					
					<!-- Телефон пользователя -->
					<v-text-field
						label="Телефон"
						v-model="formData.userPhone"
						:rules="[rules.required, rules.phone]"
						required
					></v-text-field>
					
					<!-- Статус бронирования -->
					<v-select
						label="Статус"
						v-model="formData.status"
						:items="statusOptions"
						item-title="text"
						:rules="[rules.required]"
						required
					></v-select>
					
					<!-- Даты заезда и выезда -->
					<v-select
						v-if="listing.isHotelType"
						v-model="chosenRoomId"
						:items="listing.rooms"
						item-title="name"
						item-value="id"
						label="Выберите номер"
						required
					></v-select>
					<v-card class="dates" @click="datePickerModal = true">
						<v-icon :icon="mdiCalendarMonthOutline"></v-icon>
						<span v-if="dateRange.start && dateRange.end">{{formatDate(dateRange.start)}} - {{formatDate(dateRange.end)}}</span>
						<span v-else>Выберите даты проживания</span>
					</v-card>
					
					<DateRangePickModal v-model:range="dateRange" v-model:is-open="datePickerModal"/>
					
					<p v-if="chosenUser" class="mb-4">Бонусов у пользователя: {{chosenUser.bonusPoints}}</p>
					<div v-if="calculatedPrices && chosenUser && chosenUser?.bonusPoints > 0">
						<v-switch
							v-model="bonusApplied"
							label="Списать бонусы"
							color="rgb(112, 89, 255)"
							hide-details
							block
						/>
					</div>
					
					<div v-if="calculatedPrices">
						<div class="price-block">
							<span class="days">Предоплата:</span>
							<div class="price" v-if="calculatedPrices && chosenUser && chosenUser.bonusPoints > 0 && bonusApplied">
								<span>{{calculatedPrices.prepayWithBonus.toLocaleString()}} руб.</span>
								<strike>{{calculatedPrices.prepay.toLocaleString()}} руб.</strike>
							</div>
							<span class="price" v-else>{{calculatedPrices.prepay.toLocaleString()}} руб.</span>
						</div>
						<div class="price-block">
							<span class="days">За {{formatDays(calculatedPrices.daysCount)}}</span>
							<div class="price" v-if="calculatedPrices && chosenUser && chosenUser.bonusPoints > 0 && bonusApplied">
								<span>{{calculatedPrices.totalPriceWithBonus.toLocaleString()}} руб.</span>
								<strike>{{calculatedPrices.totalPrice.toLocaleString()}} руб.</strike>
							</div>
							<span class="price" v-else>{{calculatedPrices.totalPrice.toLocaleString()}} руб.</span>
						</div>
					</div>
					
					
					<!-- Количество взрослых и детей -->
					<v-text-field
						label="Количество взрослых"
						v-model.number="formData.adults"
						type="number"
						min="1"
						:rules="[rules.required, rules.minValue(1)]"
						required
					></v-text-field>
					
					<v-text-field
						label="Количество детей"
						v-model.number="formData.childrens"
						type="number"
						min="0"
						:rules="[rules.nonNegative]"
					></v-text-field>
					
					<!-- Комментарий -->
					<v-textarea
						label="Комментарий"
						v-model="formData.comment"
					></v-textarea>
					
					<!-- Трансфер -->
					<v-checkbox
						label="Требуется трансфер"
						v-model="formData.transfer"
					></v-checkbox>
					
					<v-textarea
						label="Комментарий к трансферу"
						v-model="formData.transferComment"
						v-if="formData.transfer"
					></v-textarea>
					
				</v-form>
			</v-card-text>
			
			<v-card-actions>
				<v-spacer></v-spacer>
				<v-btn color="grey"  @click="closeDialog">Отмена</v-btn>
				<v-btn color="primary" @click="onSubmit" :disabled="!isFormValid">
					{{ bookingToUpdate ? 'Сохранить изменения' : 'Создать бронирование' }}
				</v-btn>
			</v-card-actions>
			<div v-if="serverErrors.length > 0" style="color: red; margin: 16px 0; text-align: center">
				<ul>
					<li v-for="(error, index) in serverErrors" :key="index">
						{{ error }}
					</li>
				</ul>
			</div>
		</v-card>
	</v-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import {mdiCalendarMonthOutline, mdiClose, mdiMagnify} from "@mdi/js";
import {formatDate} from "~/modules/Listing/utils/dates";
import DateRangePickModal from "~/modules/Common/UI/DateRangePickModal.vue";
import useListing from "~/modules/Listing/composables/useListing";
import {calculatePrices} from "~/modules/Listing/utils/calculatePrices";
import {PREPAY_PERCENT} from "~/modules/Listing/constans";
import {formatDays} from "../../../../utils/utils";
import UserSearchDialog from "~/modules/Admin/Listing/components/UserSearchDialog.vue";
import type {ListingBookingUserResponse} from "~/modules/Admin/Listing/types/response.types";
import BtnPrimary from "~/modules/Common/UI/BtnPrimary.vue";
import type {BookingCreateDTO} from "~/modules/Listing/types/dto.types";
import {ListingBookingApi} from "~/modules/Admin/Listing/api/listingBookingApi";
import type {H3Error} from "h3";


const {listing, initListingData} = useListing();
const {isMobile} = useDevice()

const isUserSearchDialogOpen = ref(false);

function openUserSearchDialog() {
	isUserSearchDialogOpen.value = true;
}



// Пропсы компонента
const props = defineProps<{
	bookingToUpdate: any | null;
}>();


const isOpen = defineModel<boolean>('isOpen');
const emit = defineEmits<{
	onSave: () => void
}>();

const dateRange = ref<{start: Date | null, end: Date | null}>({
	start: null,
	end: null,
});
const datePickerModal = ref(false);

const chosenRoomId = ref<number | null>(null);
const chosenUserId = ref<number | null>(null);
const chosenUser = ref<ListingBookingUserResponse | null>(null);
const bonusApplied = ref(false);

const chosenRoom = computed(() => {
	return chosenRoomId.value
		? listing.value.rooms.find((room) => room.id === chosenRoomId.value)
		: null;
});

const bookingToUpdate = ref(props.bookingToUpdate);

const calculatedPrices = computed(() => {
	if (!dateRange.value.start || !dateRange.value.end) {
		return null;
	}
	const pricePeriods = chosenRoom.value
		? chosenRoom.value.pricePeriods
		: listing.value.pricePeriods;
	
	const minPrice = chosenRoom.value
		? chosenRoom.value.minPrice
		: listing.value.minPrice;
	// Проверяем, редактируем ли бронь
	const isEditing = props.bookingToUpdate.bonusApplied;
	
	if (isEditing) {
		const { daysCount} = calculatePrices(
			pricePeriods,
			minPrice,
			dateRange.value.start,
			dateRange.value.end
		);
		return {
			totalPrice: props.bookingToUpdate.totalPrice,
			prepay: props.bookingToUpdate.prepay,
			bonusApplied: props.bookingToUpdate.bonusApplied,
			bonusAppliedCount: props.bookingToUpdate.bonusAppliedCount,
			totalPriceWithBonus: props.bookingToUpdate.totalPriceWithBonus,
			daysCount,
			prepayWithBonus: props.bookingToUpdate.prepayWithBonus
		};
	}
	// Если создаём новую бронь, рассчитываем данные
	const withBonus = bonusApplied.value && chosenUser.value && chosenUser.value?.bonusPoints > 0;
	
	
	
	const { totalPrice, daysCount, dailyPrice } = calculatePrices(
		pricePeriods,
		minPrice,
		dateRange.value.start,
		dateRange.value.end
	);
	
	const prepay = parseInt((totalPrice * PREPAY_PERCENT).toFixed(0));
	
	const userBonusPoints = chosenUser.value?.bonusPoints || 0;
	const bonusAppliedCount = withBonus ? Math.min(userBonusPoints, totalPrice) : 0;
	
	const totalPriceWithBonus = totalPrice - bonusAppliedCount;
	const prepayWithBonus = parseInt((totalPriceWithBonus * PREPAY_PERCENT).toFixed(0));
	
	return {
		totalPrice,
		prepay,
		bonusApplied: withBonus,
		bonusAppliedCount,
		totalPriceWithBonus,
		prepayWithBonus,
		daysCount,
		dailyPrice
	};
});



const formData = ref({
	userName: '',
	userSurname: '',
	userPhone: '',
	status: 'PENDING',
	adults: 1,
	childrens: 0,
	comment: '',
	transfer: false,
	transferComment: '',
});

function handleUserSelect(user: ListingBookingUserResponse) {
	console.log('Выбран пользователь с ID:', user.id);
	formData.value.userName = user.name;
	formData.value.userSurname = user.surname;
	formData.value.userPhone = user.phone;
	chosenUserId.value = user.id;
	chosenUser.value = user;
	console.log(user)
}

// Опции статусов
const statusOptions = [
	{ value: 'PENDING', text: 'В ожидании' },
	{ value: 'CONFIRMED', text: 'Подтверждено' },
	{ value: 'CANCELLED', text: 'Отменено' },
	{ value: 'COMPLETED', text: 'Завершено' },
];

// Ссылка на форму для валидации
const formRef = ref();
const isFormValid = ref(false);

// Правила валидации
const rules = {
	required: (value: any) => !!value || 'Обязательное поле',
	minLength: (length: number) => (value: string) =>
		(value && value.length >= length) || `Минимум ${length} символа`,
	minValue: (min: number) => (value: number) =>
		(value >= min) || `Минимальное значение ${min}`,
	nonNegative: (value: number) => (value >= 0) || 'Значение не может быть отрицательным',
	positive: (value: number) => (value > 0) || 'Значение должно быть положительным',
	validDate: (value: string) =>
		!isNaN(Date.parse(value)) || 'Некорректная дата',
	afterDate: (date: string) => (value: string) =>
		new Date(value) > new Date(date) || 'Дата выезда должна быть позже даты заезда',
	phone: (value: string) => {
		const phoneRegex = /^\+?\d{10,15}$/;
		return phoneRegex.test(value) || 'Некорректный формат телефона';
	},
};



watch(
	() => props.bookingToUpdate,
	(newVal) => {
		bookingToUpdate.value = newVal;
		initializeForm();
	}
);

watch(calculatedPrices, () => {
	console.log(calculatedPrices.value)
	console.log(bookingToUpdate.value)
})


// Инициализация формы
function initializeForm() {
	if (bookingToUpdate.value) {
		formData.value = {
			userName: bookingToUpdate.value.userName || '',
			userSurname: bookingToUpdate.value.userSurname || '',
			userPhone: bookingToUpdate.value.userPhone || '',
			status: bookingToUpdate.value.status || 'PENDING',
			adults: bookingToUpdate.value.adults || 1,
			childrens: bookingToUpdate.value.childrens || 0,
			comment: bookingToUpdate.value.comment || '',
			transfer: bookingToUpdate.value.transfer || false,
			transferComment: bookingToUpdate.value.transferComment || '',
		};
		bonusApplied.value = props.bookingToUpdate.bonusApplied;
		dateRange.value.start = new Date(bookingToUpdate.value.checkIn) || null;
		dateRange.value.end = new Date(bookingToUpdate.value.checkOut) || null;
		chosenRoomId.value = bookingToUpdate.value.room ? bookingToUpdate.value.room.id : null;
		chosenUserId.value = bookingToUpdate.value.user ? bookingToUpdate.value.user.id : null
		chosenUser.value = bookingToUpdate.value.user;
	} else {
		// Если создание нового бронирования, очищаем форму
		formData.value = {
			userName: '',
			userSurname: '',
			userPhone: '',
			status: 'PENDING',
			adults: 1,
			childrens: 0,
			comment: '',
			transfer: false,
			transferComment: '',
		};
		bonusApplied.value = false;
		dateRange.value.start = null
		dateRange.value.end = null;
		chosenRoomId.value = null;
		chosenUserId.value = null;
	}
}

// Закрытие диалога
function closeDialog() {
	isOpen.value = false;
}

const pending = ref(false)
const serverErrors = ref([])
// Отправка формы
async function onSubmit() {
	console.log('dsfsdf')
	if (formRef.value) {
		const { valid } = await formRef.value.validate();
		if (!valid) {
			console.log('Form validation error')
			return;
		}
	} else {
		console.error('Form ref is not defined');
		return;
	}
	pending.value = true
	if (!dateRange.value.start && !dateRange.value.end && !calculatedPrices.value) {
		serverErrors.value = ['Не указаны даты.'];
		return;
	}
	try {
		const dto: BookingCreateDTO = {
			...formData.value,
			checkIn: dateRange.value.start,
			checkOut: dateRange.value.end,
			userId: chosenUserId.value || null,
			roomId: chosenRoomId.value || null,
			bonusApplied: bonusApplied.value,
			bonusAppliedCount: (bonusApplied && chosenUser.value) ? chosenUser.value.bonusPoints : 0,
			daysCount: calculatedPrices.value?.daysCount,
			listingId: listing.value.id,
			prepay: calculatedPrices.value?.prepay,
			prepayWithBonus: calculatedPrices.value?.prepayWithBonus,
			totalPrice: calculatedPrices.value?.totalPrice,
			totalPriceWithBonus: calculatedPrices.value?.totalPriceWithBonus,
			status: formData.value.status,
		}
		if (bookingToUpdate.value) {
			await ListingBookingApi.updateBooking(dto, bookingToUpdate.value.id)
		} else {
			await ListingBookingApi.createBooking(dto)
		}
		emit('onSave')
	} catch (error: H3Error) {
		serverErrors.value = [error.data.message]
	} finally {
		pending.value = false
	}
}
</script>

<style scoped>
.dates {
	width: 100%;
	background: #F0F3F7 !important;
	border-radius: 8px;
	box-shadow: none !important;
	padding: 12px 12px;
	display: flex;
	align-items: center;
	gap: 8px;
	color: #333D46;
	margin-bottom: 16px;
}

.price {
	font-weight: 500;
	display: flex;
	gap: 8px;
}
.days {
	color: #6a6d81;
	line-height: 24px;
}
.price-block {
	color: #6a6d81;
	margin-bottom: 16px;
	display: flex;
	justify-content: space-between;
}
</style>