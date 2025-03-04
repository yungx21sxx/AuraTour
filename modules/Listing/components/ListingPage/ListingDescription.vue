<script setup lang="ts">
	import useListingBooking from "~/modules/Listing/composables/useListingBooking";
	import {getRoomString, getWordWithProperEnding} from "~/modules/Listing/utils/stringTransformers";
	import useListing from "~/modules/Listing/composables/useListing";
	import RoomsIcon from "~/modules/Listing/icons/RoomsIcon.vue";
	import FitIcon from "~/modules/Listing/icons/FitIcon.vue";
	import BedIcon from "~/modules/Listing/icons/BedIcon.vue";
	
	const {listing} = useListing()
	
	const months = [
		"января", "февраля", "марта", "апреля", "мая", "июня",
		"июля", "августа", "сентября", "октября", "ноября", "декабря"
	];
	
	const formattedPricePeriods = computed(() => {
		if (listing.value.isHotelType && listing?.pricePeriods?.length === 0)
			return []
		
		const { pricePeriods } = listing.value;
		return pricePeriods
			.map(({ price, startDay, endDay, startMonth, endMonth }) => {
				const start = `${startDay} ${months[startMonth - 1]}`;
				const end = `${endDay} ${months[endMonth - 1]}`;
				const range = startMonth === endMonth ? `${start} - ${end}` : `${start} - ${end}`;
				return { price, range };
			})
			.sort((a, b) => {
				// Сортируем сначала по стартовому месяцу, затем по стартовому дню
				const aStartMonth = pricePeriods.find(p => p.price === a.price)?.startMonth || 0;
				const bStartMonth = pricePeriods.find(p => p.price === b.price)?.startMonth || 0;
				const aStartDay = pricePeriods.find(p => p.price === a.price)?.startDay || 0;
				const bStartDay = pricePeriods.find(p => p.price === b.price)?.startDay || 0;
				return aStartMonth - bStartMonth || aStartDay - bStartDay;
			});
	});

</script>

<template>
	<div class="info listing-block">
		<h2 class="info__title">Описание</h2>
		<div class="info__chips" v-if="!listing.isHotelType">
			<div class="chip" v-if="listing.places">
				<BedIcon/>
				<span>
					{{getWordWithProperEnding( listing.places, 'место')}}
				</span>
			</div>
			<div class="chip" v-if="listing.area">
				<FitIcon/>
				<span>
					{{listing.area}} м<sup>2</sup>
				</span>
			</div>
			<div class="chip" v-if="listing.badCount">
				<RoomsIcon/>
				<span>
					{{getRoomString(listing.badCount)}}
				</span>
			</div>
			<template v-if="listing.flatProperties">
				<div class="chip">
					<span>
						Этаж: {{listing.flatProperties.floor}} из {{listing.flatProperties.maxFloor}}
					</span>
				</div>
				<div class="chip" v-if="listing.flatProperties.elevator">
					<span>
						Есть лифт
					</span>
				</div>
			</template>
		</div>
		<p class="info__text mb-6 mt-4" style="white-space: pre-wrap;">{{listing.description}}</p>
		<div class="info__amenities mt-4">
			<h3 class="info__subtitle">Какие удобства вас ждут</h3>
			<div class="info__chips listing-chips">
				<div
					v-for="(amenity, index) of listing.amenities"
				>{{index !== listing.amenities.length - 1 ? amenity + ', ' : amenity}}</div>
			</div>
		</div>
		<div class="info__amenities mt-4" v-if="listing.infrastructure.length > 0">
			<h3 class="info__subtitle">Инфраструктура</h3>
			<div class="info__chips listing-chips">
				<div
					v-for="(infrastructure, index) of listing.infrastructure"
				>{{index !== listing.infrastructure.length - 1 ? infrastructure + ', ' : infrastructure}}</div>
			</div>
		</div>
		<div class="info__food mt-4">
			<h3 class="info__subtitle">Питание</h3>
			<div class="info__chips listing-chips">
				<div
					v-for="(food, index) of listing.food"
				>{{index !== listing.food.length - 1 ? food + ', ' : food}}</div>
			</div>
			<div class="info__text" v-if="listing.foodDescription">
				<v-alert
					type="info"
					variant="tonal"
				>
					<template #text>
						<p style="white-space: pre-wrap;">{{listing.foodDescription}}</p>
					</template>
				</v-alert>
			</div>
			<div class="mt-4" v-if="!listing.isHotelType && listing?.pricePeriods?.length > 0">
				<h3 class="info__subtitle">Все цены</h3>
				<v-table>
					<thead>
					<tr>
						<th class="text-left">
							Дата
						</th>
						<th class="text-left">
							Цена
						</th>
					</tr>
					</thead>
					<tbody>
					<tr
						v-for="period of formattedPricePeriods"
					>
						<td>{{ period.range }}</td>
						<td>{{ period.price.toLocaleString('ru-RU') }} ₽</td>
					</tr>
					</tbody>
				</v-table>
			</div>
		</div>
	
	</div>

</template>

<style scoped lang="scss">

.info__chips {
	margin: 16px 0 24px 0;
	display: flex;
	flex-wrap: wrap;
	gap: 12px;
}


.chip {
	display: flex;
	align-items: center;
	gap: 8px;
	font-size: 16px;
	border-radius: 999px;
	color: $text-main;
	background: #F1F3F9;
	padding: 3px 12px;
}


</style>