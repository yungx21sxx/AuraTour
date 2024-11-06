<script setup lang="ts">
	import type {PricePeriodCreateDTO} from "~/types/dto.types";
	import useBooking from "~/modules/Booking/composables/useBooking";
	import BtnPrimary from "~/modules/Common/UI/BtnPrimary.vue";
	import {mdiCalendarMonthOutline, mdiClose} from "@mdi/js";
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
	const priceForRange = ref<number | null>(null);
	
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
	<v-card elevation="0">
		<v-card-item v-if="!preview">
			<div style="max-width: 700px">
				<DatePicker
					v-model.range="currentDatesRange"
					:min-date="new Date()"
					expanded
					:columns="isMobile ? 1 : 2"
					:attributes="attrs"
				/>
				
				<v-text-field required variant="outlined" v-model.number="priceForRange" type="number" label="Цена" class="mt-4"/>
			</div>
			<BtnPrimary @click="createPricePeriod">Добавить период</BtnPrimary>
			
			<div class="prices">
				<div
					v-if="pricePeriods"
					v-for="(pricePeriod, index) in pricePeriods"
					class="price-period"
				>
					<v-icon :icon="mdiCalendarMonthOutline"></v-icon>
					<div>
						<div class="date">{{beautifyDate(pricePeriod.startDate)}} - {{beautifyDate(pricePeriod.endDate)}}</div>
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

</style>