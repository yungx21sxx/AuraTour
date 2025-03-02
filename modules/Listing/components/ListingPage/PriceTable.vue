<template>
	<v-data-table
		:headers="headers"
		:items="rooms"
		item-key="id"
		hide-default-footer
	>
		<template #item="{ item, columns }">
			<tr>
				<!-- Название номера -->
				<td class="font-weight-bold text-left pa-4">
					{{ item.name }}
				</td>
				
				<!-- Цены по месяцам -->
				<td
					v-for="column in columns.filter(c => c.key !== 'name')"
					:key="column.key"
					class="text-center pa-4"
				>
					{{ getPriceForMonth(item, column.month) }}
				</td>
			</tr>
		</template>
	</v-data-table>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { PropType } from 'vue';
import type {IRoomResponse} from "~/modules/Listing/types/response.types";

const props = defineProps({
	rooms: {
		type: Array as PropType<IRoomResponse[]>,
		required: true,
		default: () => []
	}
});

const currentYear = new Date().getFullYear();

const headers = computed(() => {
	const months = [
		'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
		'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
	];
	
	return [
		{
			title: 'Номер',
			key: 'name',
			align: 'start',
			sortable: false
		},
		...months.map((month, index) => ({
			title: `${month} ${currentYear}`,
			key: `month-${index}`,
			month: index,
			align: 'center',
			sortable: false
		}))
	];
});

const getPriceForMonth = (room: IRoomResponse, targetMonth: number) => {
	const periods = room.pricePeriods.filter(period => {
		const periodStart = new Date(currentYear, period.startMonth, period.startDay);
		const periodEnd = new Date(currentYear, period.endMonth, period.endDay);
		const monthStart = new Date(currentYear, targetMonth, 1);
		const monthEnd = new Date(currentYear, targetMonth + 1, 0);
		
		return periodStart <= monthEnd && periodEnd >= monthStart;
	});
	
	if (!periods.length) return '-';
	return Math.min(...periods.map(p => p.price)).toLocaleString();
};
</script>

<style scoped>
td {
	min-width: 120px;
}
</style>