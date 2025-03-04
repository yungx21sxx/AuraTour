<script setup lang="ts">
	import useListing from "~/modules/Listing/composables/useListing";
	import ListingRoomItem from "~/modules/Listing/components/ListingPage/ListingRoomItem.vue";
	
	const {listing} = useListing();
</script>

<template>
	<div class="rooms listing-block" v-if="listing.rooms.length > 0">
		<h2 class="rooms__title">Номера и цены</h2>
		<div
			class="rooms__wrapper"
		>
			<ListingRoomItem
				v-for="room of listing.rooms"
				:room="room"
				:key="room.id"
			/>
		</div>
		
	</div>
	
</template>

<style scoped lang="scss">


@media screen and (max-width: 640px) {
	.room {
		&__main {
			grid-template-columns: 1fr !important;
		}
	}
}



.chip {
	display: flex;
	align-items: center;
	gap: 8px;
	font-size: 14px;
	border-radius: 999px;
	color: #626262;
	background: #F1F3F9;
	padding: 3px 12px;
}

.rooms__title {
	margin-bottom: 8px;
}

.room {
	&.no-photos &__main {
		display: block !important;
	}
	
	&__included {
		margin-top: 8px;
		color: $text-gray !important;
		font-size: 14px;
	}
	&__main {
		display: grid;
		grid-template-columns: 250px 1fr;
		gap: 16px;
	}
	&__title {
		margin-bottom: 8px;
	}
	
	&__carousel {
		height: 200px;
		border-radius: 7px;
	}
	&__amenities {
		display: flex;
		flex-wrap: wrap;
		margin-bottom: 16px;
	}
	&__amenity {
		color: $text-gray;
		//margin-right: 8px;
		display: flex;
		align-items: center;
		font-size: 14px;
		&:not(&_last)::after {
			align-items: center;
			content: "·";
			display: flex;
			height: 14px;
			font-size: 20px;
			justify-content: center;
			left: -14px;
			width: 14px;
		}
	}
}

.order {
	display: flex;
	margin-top: 16px;
	justify-content: space-between;
	align-items: center;
	.price {
		font-weight: bold;
		font-size: 20px;
	}
}



</style>