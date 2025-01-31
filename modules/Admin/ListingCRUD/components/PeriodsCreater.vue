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
		
		if (month < 1 || month > 12) {
			throw new Error("Некорректный номер месяца");
		}
		
		const daysInMonth = new Date(new Date().getFullYear(), month, 0).getDate();
		if (day < 1 || day > daysInMonth) {
			throw new Error(`Некорректный день: ${day} в месяце ${months[month - 1]}`);
		}
		
		return `${day} ${months[month - 1]}`;
	}
	
	const tab = ref(1);
	const jsonDateInput = ref(null);
	
	const createPeriodsFromJson = () => {
		if (!jsonDateInput.value) {
			alert('Введите данные');
			return;
		}
		
		try {
			const parsed = JSON.parse(jsonDateInput.value);
			if (!Array.isArray(parsed)) {
				throw new Error('Данные не являются массивом');
			}
			for (const period of parsed) {
				if (typeof period.startDay !== 'number' || typeof period.startMonth !== 'number' || typeof period.endDay !== 'number' || typeof period.endMonth !== 'number' || typeof period.price !== 'number') {
					throw new Error('Некорректные данные');
				}
				if (!isValidPeriod(period)) {
					throw new Error(`Некорректные даты, ${formatDate(period.startDay, period.startMonth)} - ${formatDate(period.endDay, period.endMonth)}`);
				}
				if (checkOverlappingRanges([...pricePeriods.value, period] )) {
					throw new Error('Периоды пересекаются');
				}
				pricePeriods.value.push(period);
			}
		} catch (e) {
			console.error(e);
			alert(e.message);
		}
		
		jsonDateInput.value = null;
	}
	
</script>

<template>
	<v-card elevation="0">
		<v-card-item>
			<v-tabs v-model="tab">
				<v-tab :value="1">Ручной ввод</v-tab>
				<v-tab :value="2">JSON</v-tab>
			</v-tabs>
			
			<v-tabs-window v-model="tab">
				<v-tabs-window-item :value="1">
					<div class="date-input mt-4">
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
				</v-tabs-window-item>
				<v-tabs-window-item :value="2">
					<p class="mt-4">
						Тип данных:
					</p>
					<code class="mt-4 mb-4">
						PricePeriod {
							startDay: number,
							endDay: number,
							startMonth: number,
							endMonth: number,
							price: number
						}
					</code>
					<v-textarea v-model="jsonDateInput"></v-textarea>
					<v-btn @click="createPeriodsFromJson">Создать периоды</v-btn>
				</v-tabs-window-item>
			</v-tabs-window>
		
			
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