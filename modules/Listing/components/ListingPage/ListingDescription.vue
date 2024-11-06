<script setup lang="ts">
	import useListingBooking from "~/modules/Listing/composables/useListingBooking";
	import {getRoomString, getWordWithProperEnding} from "~/modules/Listing/utils/stringTransformers";
	import useListing from "~/modules/Listing/composables/useListing";
	
	const {listing} = useListing()
	

</script>

<template>
	<div class="info listing-block">
		<h2 class="info__title">Описание</h2>
		<div class="info__text mt-2" v-html="listing.description"></div>
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