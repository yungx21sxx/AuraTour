<script setup lang="ts">
	import useListing from "~/components/pages/Listing/useListing";
	import {getRoomString, getWordWithProperEnding} from "~/utils/utils";
	
	const {listing} = useListing()
	

</script>

<template>
	<div class="info listing-block">
		<h2 class="info__title">Описание</h2>
		<div class="info__text mt-2" v-html="listing.description"></div>
		<div class="info__chips listing-chips" v-if="listing.rooms.length === 0">
			<v-chip color="primary" prepend-icon="mdi-bed-outline">{{getWordWithProperEnding(listing.places, 'место')}}</v-chip>
			<v-chip color="primary" v-if="listing.area" prepend-icon="mdi-ruler-square-compass">Общая площадь: {{listing.area}} м<sup>2</sup></v-chip>
			<v-chip color="primary">{{getRoomString(listing.badCount)}}</v-chip>
			<v-chip color="primary" v-if="listing.maxFloor">Этаж {{listing.floor}} из {{listing.maxFloor}}</v-chip>
			<v-chip color="primary" v-if="listing.elevator">Есть лифт</v-chip>
		</div>
		<div class="info__amenities mt-4">
			<h3 class="info__subtitle">Какие удобства вас ждут</h3>
			<div class="info__chips listing-chips">
				<v-chip
					color="primary"
					v-for="amenity of listing.amenities"
				>{{amenity}}</v-chip>
			</div>
		</div>
		<div class="info__food mt-4">
			<h3 class="info__subtitle">Питание</h3>
			<div class="info__chips listing-chips">
				<v-chip
					color="primary"
					v-for="food of listing.food"
				>{{food}}</v-chip>
			</div>
		</div>
	
	</div>

</template>

<style scoped lang="scss">

.info__chips {
	margin-top: 16px;
}

</style>