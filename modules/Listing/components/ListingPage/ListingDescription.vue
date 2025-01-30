<script setup lang="ts">
	import useListingBooking from "~/modules/Listing/composables/useListingBooking";
	import {getRoomString, getWordWithProperEnding} from "~/modules/Listing/utils/stringTransformers";
	import useListing from "~/modules/Listing/composables/useListing";
	import RoomsIcon from "~/modules/Listing/icons/RoomsIcon.vue";
	import FitIcon from "~/modules/Listing/icons/FitIcon.vue";
	import BedIcon from "~/modules/Listing/icons/BedIcon.vue";
	
	const {listing} = useListing()
	

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
				<div class="chip"v-if="listing.flatProperties.elevator">
					<span>
						Есть лифт
					</span>
				</div>
			</template>
		</div>
		<div class="info__text mb-6" v-html="listing.description"></div>
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
		</div>
	
	</div>

</template>

<style scoped lang="scss">

.info__chips {
	margin: 8px 0 16px 0;
}

//.chip {
//	//margin-right: 8px;
//	display: flex;
//	align-items: center;
//	font-size: 16px;
//	&:not(&_last)::after {
//		align-items: center;
//		color: $text-gray;
//		content: "·";
//		display: flex;
//		height: 14px;
//		font-size: 20px;
//		justify-content: center;
//		left: -14px;
//		width: 14px;
//	}
//}

</style>