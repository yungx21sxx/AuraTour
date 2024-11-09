<template>
	<v-container>
		<!-- Фильтры -->
		<v-row>
			<v-col cols="12" md="3">
				<v-autocomplete
					v-model="selectedCity"
					:items="cities"
					item-title="cityName"
					item-value="id"
					label="Выберите город"
					return-object
					hide-details
					clearable
				></v-autocomplete>
			</v-col>
			
			<v-col cols="12" md="3">
				<v-select
					v-model="selectedManager"
					:items="managers"
					item-title="fullName"
					item-value="id"
					label="Выберите менеджера"
					return-object
					hide-details
					clearable
				></v-select>
			</v-col>
			
			<v-col cols="12" md="3">
				<v-select
					v-model="selectedStatus"
					:items="statusOptions"
					item-title="label"
					item-value="value"
					label="Выберите статус"
					hide-details
					clearable
				></v-select>
			</v-col>
			
			<v-col cols="12" md="3">
				<v-select
					v-model="selectedSortBy"
					:items="sortOptions"
					item-title="label"
					item-value="value"
					hide-details
					label="Сортировать по"
					clearable
				></v-select>
			</v-col>
		</v-row>
		
		<!-- Список бронирований -->
		<div class="booking-list mt-4">
			<v-expansion-panels>
				<FullBookingItemAdmin
					v-for="booking of bookings"
					:booking="booking"
					:key="booking.id"
					@on-update="onBookingsUpdate"
				/>
			</v-expansion-panels>
			
			<!-- Индикатор загрузки -->
			<div v-if="isLoading" class="loading-indicator">
				<v-progress-circular indeterminate color="primary"></v-progress-circular>
			</div>
			
			<!-- Элемент-пустышка для Intersection Observer -->
			<div ref="observerElement"></div>
		</div>
	</v-container>
</template>

<script lang="ts" setup>
import { ref, watch, computed, onMounted, onBeforeUnmount } from 'vue';
import { useFetch } from '#app';
import useSearch from "~/modules/Booking/composables/useSearch";
import {mdiCalendarMonthOutline, mdiPencil} from "@mdi/js";
import BtnPrimary from "~/modules/Common/UI/BtnPrimary.vue";
import BtnSecondary from "~/modules/Common/UI/BtnSecondary.vue";
import FullBookingItemAdmin from "~/modules/Admin/Booking/components/FullBookingItemAdmin.vue";
import {useAuthUser} from "~/modules/Auth/composables/useAuthUser";

definePageMeta({
	layout: 'admin',
	middleware: ['admin-only']
})

interface City {
	cityName: string;
	id: number;
}

interface Manager {
	fullName: string;
	id: number;
}

type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';

interface StatusOption {
	value: BookingStatus;
	label: string;
}

interface SortOption {
	value: string;
	label: string;
}

// Состояние фильтров
const selectedCity = ref<City | null>(null);
const selectedManager = ref<Manager | null>(null);
const selectedStatus = ref<BookingStatus | null>(null);
const selectedSortBy = ref<string>('createdAt'); // По умолчанию сортировка по дате создания

// Пагинация
const currentPage = ref(1);
const pageSize = ref(10);
const totalPages = ref(1);

// Списки для select
const cities = ref<City[]>([]);
const managers = ref<Manager[]>([]);
const statusOptions: StatusOption[] = [
	{ value: 'PENDING', label: 'Ожидает подтверждения' },
	{ value: 'CONFIRMED', label: 'Подтверждено' },
	{ value: 'CANCELLED', label: 'Отменено' },
	{ value: 'COMPLETED', label: 'Завершено' },
];

const sortOptions: SortOption[] = [
	{ value: 'createdAt', label: 'Дате создания' },
	{ value: 'checkIn', label: 'Дате заселения' },
];

// Функции-заглушки для загрузки городов и менеджеров
async function loadCities() {
	const {loadSearchData, searchData} = useSearch()
	await loadSearchData();
	cities.value = searchData.value.cities.map(city => ({id: city.id, cityName: city.cityName}))
}

async function loadManagers() {
	managers.value = await $fetch('/api/users/load-managers');
}

// Создаём свойство fullName для отображения в v-select

// Список бронирований
const bookings = ref<any[]>([]);
const isLoading = ref(false);
const isAllDataLoaded = ref(false);

// Элемент для Intersection Observer
const observerElement = ref<HTMLElement | null>(null);
let observer: IntersectionObserver | null = null;


const authUser = useAuthUser()
// Загрузка данных при монтировании компонента
onMounted(async () => {
	await loadCities();
	await loadManagers();
	if (authUser.value && authUser.value.role === 'MANAGER' && managers.value) {
		selectedManager.value = managers.value.find(manager => manager.id === authUser.value.id) || null;
	}
	resetData();
	await fetchBookings();
	initIntersectionObserver();
});

const onBookingsUpdate = async () => {
	resetData();
	await fetchBookings();
}

onBeforeUnmount(() => {
	if (observer) {
		observer.disconnect();
	}
});

// Следим за изменениями фильтров и сбрасываем состояние
watch(
	[selectedCity, selectedManager, selectedStatus, selectedSortBy],
	() => {
		resetData();
		fetchBookings();
	}
);

// Функция для сброса данных
function resetData() {
	bookings.value = [];
	currentPage.value = 1;
	totalPages.value = 1;
	isAllDataLoaded.value = false;
};


// Функция для получения списка бронирований
async function fetchBookings() {
	if (isLoading.value || isAllDataLoaded.value) {
		return;
	}
	
	isLoading.value = true;
	
	const queryParams: Record<string, any> = {
		page: currentPage.value,
		pageSize: pageSize.value,
		sortBy: selectedSortBy.value,
	};
	
	if (selectedCity.value) {
		queryParams.cityId = selectedCity.value.id;
	}
	
	if (selectedManager.value) {
		queryParams.managerId = selectedManager.value.id;
	}
	
	if (selectedStatus.value) {
		queryParams.status = selectedStatus.value;
	}
	
	const { data, error } = await useFetch('/api/bookings/all', {
		params: queryParams,
	});
	
	if (error.value) {
		console.error('Ошибка при загрузке бронирований:', error.value);
		isLoading.value = false;
		return;
	}
	
	// Обработка полученных данных
	if (data.value.bookings.length > 0) {
		bookings.value.push(...data.value.bookings);
		totalPages.value = Math.ceil(data.value.totalCount / pageSize.value);
		currentPage.value += 1;
		
		if (currentPage.value > totalPages.value) {
			isAllDataLoaded.value = true;
		}
	} else {
		isAllDataLoaded.value = true;
	}
	
	isLoading.value = false;
}

// Инициализация Intersection Observer
function initIntersectionObserver() {
	if (observer) {
		observer.disconnect();
	}
	
	observer = new IntersectionObserver(
		(entries) => {
			if (entries[0].isIntersecting && !isLoading.value && !isAllDataLoaded.value) {
				fetchBookings();
			}
		},
		{
			root: null, // Весь viewport
			rootMargin: '0px',
			threshold: 1.0,
		}
	);
	
	if (observerElement.value) {
		observer.observe(observerElement.value);
	}
}

// Функция для форматирования даты
function formatDate(dateString: string) {
	const options: Intl.DateTimeFormatOptions = {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	};
	return new Date(dateString).toLocaleDateString('ru-RU', options);
}
</script>

<style scoped>
/* Адаптивный дизайн */
@media (max-width: 600px) {
	.v-col {
		max-width: 100%;
		flex-basis: 100%;
	}
}

/* Стили для списка бронирований */

.booking-item {
	padding: 16px;
	border-bottom: 1px solid #e0e0e0;
}

@media screen and (max-width: 500px){
	.booking-list {
		margin: 0 -32px;
	}
}

.loading-indicator {
	display: flex;
	justify-content: center;
	padding: 16px;
}
</style>