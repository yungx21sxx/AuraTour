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
					class="chip"
					v-for="amenity of listing.amenities"
				>{{amenity}}</div>
			</div>
		</div>
		<div class="info__food mt-4">
			<h3 class="info__subtitle">Питание</h3>
			<div class="info__chips listing-chips">
				<div
					class="chip"
					v-for="food of listing.food"
				>{{food}}</div>
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