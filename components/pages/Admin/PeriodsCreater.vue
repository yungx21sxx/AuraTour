<script setup lang="ts">
	import type {PricePeriodCreateDTO} from "~/types/dto.types";
	import useBooking from "~/components/Booking/useBooking";
	const {beautifyDate} = useBooking()
	const {isMobile} = useDevice();
	const pricePeriods = defineModel<PricePeriodCreateDTO[]>({
		required: true,
	});
	
	defineProps<{
		preview?: boolean
	}>()
	const currentDatesRange = ref({
		start: null,
		end: null,
	});
	const priceForRange = ref(0);
	
	const attrs = computed(() => [
		...pricePeriods.value.map((pricePeriod: PricePeriodCreateDTO) => (
			{
				highlight: 'green',
				dates: {start: pricePeriod.startDate, end: pricePeriod.endDate},
				popover: {
					label: `с ${beautifyDate(pricePeriod.startDate)} до ${beautifyDate(pricePeriod.endDate)}. Цена ${pricePeriod.price.toLocaleString('ru-RU')} руб.`,
					visibility: 'click',
				}
			}
	))])
	
	function isDateOverlap(period1: PricePeriodCreateDTO, period2: PricePeriodCreateDTO): boolean {
		const startDate1 = new Date(period1.startDate);
		const endDate1 = new Date(period1.endDate);
		const startDate2 = new Date(period2.startDate);
		const endDate2 = new Date(period2.endDate);
		
		return startDate1 <= endDate2 && endDate1 >= startDate2;
	}
	
	function checkPriceOverlap(periods: PricePeriodCreateDTO[], newPeriod: PricePeriodCreateDTO): boolean {
		for (let period of periods) {
			if (isDateOverlap(period, newPeriod)) {
				return true;
			}
		}
		return false;
	}

	
	const createPricePeriod = () => {
		if (currentDatesRange.value.start && currentDatesRange.value.end && priceForRange.value !== 0 && pricePeriods.value) {
			
			const tmp = {
				startDate: currentDatesRange.value.start,
				endDate: currentDatesRange.value.end,
				price: priceForRange.value
			}
			if (checkPriceOverlap(pricePeriods.value, tmp)) {
				return;
			}
			pricePeriods.value.push(tmp)
			
			currentDatesRange.value.start = null
			currentDatesRange.value.end = null
			priceForRange.value = 0
		}
	}
	
	
	
	
	
</script>

<template>
	<v-card elevation="0" max-width="700px">
		<v-card-title v-if="!preview">Выберите даты начала и конца периода, затем укажите цену</v-card-title>
		<v-card-item v-if="!preview">
		
			<DatePicker
				v-model.range="currentDatesRange"
				:min-date="new Date()"
				expanded
				:columns="isMobile ? 1 : 2"
				:attributes="attrs"
			/>
		
			
			<v-text-field v-model.number="priceForRange" type="number" label="Цена" class="mt-4"/>
			<v-btn color="blue" @click="createPricePeriod">Добавить период</v-btn>
		</v-card-item>
		<v-list
			v-if="pricePeriods"
			v-for="(pricePeriod, index) in pricePeriods"
		>
			<v-list-item>
				<v-list-item-title>
					Цена <strong>{{pricePeriod.price}} руб. </strong> <br v-if="isMobile"> Период с {{beautifyDate(pricePeriod.startDate)}} до {{beautifyDate(pricePeriod.endDate)}}
				</v-list-item-title>
				<template #prepend>
					<v-btn class="mr-4" icon="mdi-close" variant="elevated" density="compact" @click="pricePeriods.splice(index, 1)"/>
				</template>
			</v-list-item>
		</v-list>
	
	</v-card>
</template>

<style scoped lang="scss">

</style>