<script setup lang="ts">
	import type {PricePeriodCreateDTO} from "~/types/dto.types";
	import useBooking from "~/modules/Booking/composables/useBooking";
	import BtnPrimary from "~/modules/Common/UI/BtnPrimary.vue";
	import {mdiCalendarMonthOutline, mdiClose} from "@mdi/js";
	const {isMobile} = useDevice();
	defineProps<{
		preview?: boolean
	}>()
	
	
	const pricePeriods = defineModel<PricePeriodCreateDTO[]>({
		required: true,
	});
	
	const currentDatesRange = ref({
		startDay: null,
		endDay: null,
		startMonth: null,
		endMonth: null,
		price: null
	});
	
	const months = [
		{ index: 1, label: "Январь" },
		{ index: 2, label: "Февраль" },
		{ index: 3, label: "Март" },
		{ index: 4, label: "Апрель" },
		{ index: 5, label: "Май" },
		{ index: 6, label: "Июнь" },
		{ index: 7, label: "Июль" },
		{ index: 8, label: "Август" },
		{ index: 9, label: "Сентябрь" },
		{ index: 10, label: "Октябрь" },
		{ index: 11, label: "Ноябрь" },
		{ index: 12, label: "Декабрь" }
	];
	
	function isOverlapping(period1: PricePeriodCreateDTO, period2: PricePeriodCreateDTO) {
		// Преобразуем дату в число для сравнения (количество дней с начала года)
		const toDays = (day, month) => (month - 1) * 31 + day;
		
		const p1Start = toDays(period1.startDay, period1.startMonth);
		const p1End = toDays(period1.endDay, period1.endMonth);
		const p2Start = toDays(period2.startDay, period2.startMonth);
		const p2End = toDays(period2.endDay, period2.endMonth);
		
		// Проверяем пересечения
		return (
			(p1Start <= p2End && p1End >= p2Start) || // Пересечение
			(p2Start <= p1End && p2End >= p1Start)    // Один внутри другого
		);
	}
	
	function checkOverlappingRanges(ranges) {
		for (let i = 0; i < ranges.length; i++) {
			for (let j = i + 1; j < ranges.length; j++) {
				if (isOverlapping(ranges[i], ranges[j])) {
					return true; // Есть пересечения
				}
			}
		}
		return false; // Нет пересечений
	}
	
	function isValidPeriod(period) {
		const toDays = (day, month) => (month - 1) * 31 + day;
		
		const start = toDays(period.startDay, period.startMonth);
		const end = toDays(period.endDay, period.endMonth);
		
		return start <= end;
	}
	const createPricePeriod = () => {
		if (!currentDatesRange.value.price) {
			alert('Введите цену');
			return;
		}
		
		if (!currentDatesRange.value.startDay || !currentDatesRange.value.startMonth || !currentDatesRange.value.endDay || !currentDatesRange.value.endMonth) {
			alert('Выберите даты');
			return;
		}
		
		if (!isValidPeriod(currentDatesRange.value)) {
			alert('Некорректные даты');
			return;
		}
		
		if (checkOverlappingRanges([...pricePeriods.value, currentDatesRange.value] )) {
			alert('Периоды пересекаются');
			return;
		}
		
		pricePeriods.value.push({
			...currentDatesRange.value,
		})
		
		currentDatesRange.value = {
			startDay: null,
			endDay: null,
			startMonth: null,
			endMonth: null,
			price: null
		}
	}
	
	function formatDate(day, month) {
		const months = [
			"января", "февраля", "марта", "апреля", "мая", "июня",
			"июля", "августа", "сентября", "октября", "ноября", "декабря"
		];
		
		// Проверка корректности входных данных
		if (month < 1 || month > 12) {
			throw new Error("Некорректный номер месяца");
		}
		if (day < 1 || day > 31) {
			throw new Error("Некорректный день");
		}
		
		// Создание объекта даты с текущим годом и часом
		const date = new Date(Date.now());
		date.setUTCFullYear(new Date().getFullYear());
		date.setUTCMonth(month - 1);
		date.setUTCDate(day);
		date.setUTCHours(21, 0, 0, 0);
		
		// Форматирование даты с учётом текущего часового пояса устройства
		const formatter = new Intl.DateTimeFormat("ru-RU", {
			year: undefined,
			month: "long",
			day: "numeric",
		});
		
		return formatter.format(date);
	}
	

	
</script>

<template>
	<v-card elevation="0">
		<v-card-item>
			<div class="date-input">
				<div class="date-input__title">Начало</div>
				<div class="date-input__inputs">
					<v-number-input
						label="Число"
						v-model="currentDatesRange.startDay"
						variant="outlined"
					/>
					<v-select
						variant="outlined"
						v-model="currentDatesRange.startMonth"
						:items="months"
						label="Месяц"
						item-title="label"
						item-value="index"
					/>
				</div>
			</div>
			<div class="date-input">
				<div class="date-input__title">Конец</div>
				<div class="date-input__inputs">
					<v-number-input
						label="Число"
						v-model="currentDatesRange.endDay"
						variant="outlined"
					/>
					<v-select
						variant="outlined"
						v-model="currentDatesRange.endMonth"
						:items="months"
						label="Месяц"
						item-title="label"
						item-value="index"
					/>
				</div>
			</div>
			<v-number-input
				label="Цена"
				v-model="currentDatesRange.price"
				variant="outlined"
			/>
			<BtnPrimary @click="createPricePeriod">Добавить период</BtnPrimary>
			
			<div class="prices">
				<div
					v-if="pricePeriods"
					v-for="(pricePeriod, index) in pricePeriods"
					class="price-period"
				>
					<v-icon :icon="mdiCalendarMonthOutline"></v-icon>
					<div>
						<div class="date">
							{{formatDate(pricePeriod.startDay, pricePeriod.startMonth)}} - {{formatDate(pricePeriod.endDay, pricePeriod.endMonth)}}
						</div>
						<div class="price">{{pricePeriod.price.toLocaleString()}} руб. за ночь</div>
					</div>
					<v-btn class="mr-4" :icon="mdiClose" variant="text" density="compact" @click="pricePeriods.splice(index, 1)"/>
				</div>
			</div>
		</v-card-item>
	</v-card>
</template>

<style scoped lang="scss">

.prices {
	display: flex;
	flex-wrap: wrap;
	gap: 16px;
	margin-top: 24px;
	width: 100%;
}

.price-period {
	background: #F1F3F9;
	display: flex;
	align-items: center;
	gap: 16px;
	padding: 8px 0 8px 16px;
	border-radius: 8px;
	
	.date {
		font-size: 18px;
		font-weight: 600;
		margin-bottom: 4px;
	}
}

.date-input__title {
	font-weight: 600;
	margin-bottom: 16px;
	font-size: 18px;
}

.date-input__inputs {
	display: flex;
	gap: 16px;
	
	@media screen and (max-width: 500px) {
		flex-direction: column;
		gap: 0;
	}
	
	.v-select {
		min-width: 150px;
	}
	
	.v-input {
		min-width: 150px;
	}
}

</style>