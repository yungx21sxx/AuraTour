<template>
	<div>
		<div class="date-inputs mt-8">
			<v-card class="dates" @click="datePickerModal = true">
				<v-icon :icon="mdiCalendarMonthOutline"></v-icon>
				<span v-if="dateRange.startDate && dateRange.endDate">{{formatDate(dateRange.startDate)}} - {{formatDate(dateRange.endDate)}}</span>
				<span v-else>Выберите диапазон</span>
			</v-card>
			
			<DateRangePickModal v-model:range="dateRange" v-model:is-open="datePickerModal"/>
		</div>
		<div v-if="isLoading">Загрузка данных...</div>
		<div v-else-if="error">Ошибка загрузки данных: {{ error }}</div>
		<client-only v-else>
			<ApexCharts class="mt-4" type="line" :options="chartOptions" :series="series" />
		</client-only>
	</div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import ApexCharts from 'vue3-apexcharts';
import type { ApexOptions } from 'apexcharts';
import useListing from "~/modules/Listing/composables/useListing";
import {mdiCalendarMonthOutline} from "@mdi/js";
import DateRangePickModal from "~/modules/Common/UI/DateRangePickModal.vue";

interface StatisticItem {
	id: number;
	listingId: number;
	date: string;
	views: number;
	likes: number;
	favorites: number;
	bookings: number;
	submits: number;
	revenue: number;
	createdAt: string;
	updatedAt: string;
}

const datePickerModal = ref(false)
const dateRange = ref<{ startDate: string; endDate: string }>({
	startDate: '',
	endDate: '',
});

const series = ref<{ name: string; data: number[] }[]>([]);
const chartOptions = ref<ApexOptions>({
	chart: {
		id: 'statistics-chart',
		animations: {
			enabled: true,
		},
	},
	xaxis: {
		categories: [] as string[],
	},
	tooltip: {
		shared: true,
		intersect: false,
	},
	stroke: {
		curve: 'smooth',
	},
	markers: {
		size: 5,
	},
});

const isLoading = ref<boolean>(false);
const error = ref<string | null>(null);

// Функция для форматирования даты в 'yyyy-MM-dd'
function formatDate(date: Date): string {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0'); // Месяцы с 0 до 11
	const day = String(date.getDate()).padStart(2, '0');
	return `${year}-${month}-${day}`;
}

// Функция для получения массива дат в диапазоне
function getDatesInRange(startDate: Date, endDate: Date): Date[] {
	const date = new Date(startDate.getTime());
	const dates: Date[] = [];
	
	while (date <= endDate) {
		dates.push(new Date(date));
		date.setDate(date.getDate() + 1);
	}
	return dates;
}

// Функция для форматирования даты для меток на графике 'dd MMM'
function formatDateLabel(date: Date): string {
	const day = String(date.getDate()).padStart(2, '0');
	const monthNames = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];
	const month = monthNames[date.getMonth()];
	return `${day} ${month}`;
}

const {listing} = useListing()
const fetchData = async (): Promise<void> => {
	isLoading.value = true;
	error.value = null;
	
	const params = new URLSearchParams();
	if (dateRange.value.startDate) params.append('startDate', dateRange.value.startDate);
	if (dateRange.value.endDate) params.append('endDate', dateRange.value.endDate);
	
	try {
		const response = await $fetch(`/api/statistics/${listing.value.id}`, {
			params,
		});
		processChartData(response.statistics);
	} catch (err) {
		console.error('Ошибка при получении данных:', err);
		error.value = 'Не удалось загрузить данные.';
	} finally {
		isLoading.value = false;
	}
};

const processChartData = (data: StatisticItem[]): void => {
	const startDate = new Date(dateRange.value.startDate);
	const endDate = new Date(dateRange.value.endDate);
	
	// Получаем все даты в диапазоне
	const datesInRange = getDatesInRange(startDate, endDate);
	
	// Инициализируем массивы данных
	const views: number[] = [];
	const likes: number[] = [];
	const favorites: number[] = [];
	const bookings: number[] = [];
	const submits: number[] = [];
	const revenue: number[] = [];
	const categories: string[] = [];
	
	// Создаем карту данных для быстрого доступа
	const dataMap = new Map<string, StatisticItem>();
	data.forEach((item) => {
		const dateKey = item.date.split('T')[0]; // Получаем дату в формате 'yyyy-MM-dd'
		dataMap.set(dateKey, item);
	});
	
	datesInRange.forEach((date) => {
		const dateStr = formatDate(date); // 'yyyy-MM-dd'
		categories.push(formatDateLabel(date)); // 'dd MMM'
		const item = dataMap.get(dateStr);
		if (item) {
			views.push(item.views);
			likes.push(item.likes);
			favorites.push(item.favorites);
			bookings.push(item.bookings);
			submits.push(item.submits);
			// revenue.push(item.revenue);
		} else {
			// Если данных нет, добавляем нули
			views.push(0);
			likes.push(0);
			favorites.push(0);
			bookings.push(0);
			submits.push(0);
			// revenue.push(0);
		}
	});
	
	series.value = [
		{ name: 'Просмотры', data: views },
		{ name: 'Лайки', data: likes },
		{ name: 'Избранное', data: favorites },
		{ name: 'Бронирования', data: bookings },
		{ name: 'Заявки', data: submits },
		{ name: 'Доход', data: revenue },
	];
	
	chartOptions.value.xaxis.categories = categories;
};

// Инициализируем диапазон дат на последнюю неделю
onMounted(() => {
	const today = new Date();
	const lastWeek = new Date();
	lastWeek.setDate(today.getDate() - 7);
	
	dateRange.value.startDate = lastWeek;
	dateRange.value.endDate = today;
	
	fetchData(); // Загружаем данные при первой загрузке
});

// Отслеживаем изменения диапазона дат
watch(
	() => dateRange.value,
	() => {
		// Проверяем, что обе даты заполнены
		if (dateRange.value.startDate && dateRange.value.endDate) {
			fetchData();
		}
	},
	{ deep: true }
);
</script>

<style scoped>
.date-inputs {
	display: flex;
	justify-content: space-between;
	margin-bottom: 20px;
}

.date-inputs input {
	width: 48%;
}

@media (max-width: 600px) {
	.date-inputs {
		flex-direction: column;
	}
	.date-inputs input {
		width: 100%;
		margin-bottom: 10px;
	}
}

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
</style>