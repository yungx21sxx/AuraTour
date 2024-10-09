<script setup lang="ts">
	import useListing from "~/components/pages/Listing/useListing";
	import {getBedString} from "../../../utils/utils";
	import useCurrentPhoto from "~/components/gallery/useCurrentPhoto";
	
	const {listing, chosenRoomId, getRoomPhoto} = useListing();
	const currentPhoto = useCurrentPhoto()
	
	function openGalleryModal(roomId: number, photoIndex: number) {
		currentPhoto.value.room = {id: roomId, photoIndex}
		currentPhoto.value.modal = true
	}
	


</script>

<template>
	<div class="rooms listing-block" v-if="listing.rooms.length > 0">
		<h2 class="rooms__title">Номера и цены</h2>
		<div
			class="rooms__wrapper"
		>
			<v-card
				elevation="0"
				:class="['room mt-8', {
					'no-photos': room.photos.length === 0
				}]"
				v-for="room of listing.rooms"
			>
				<div class="room__main">
					<v-carousel
						class="room__carousel"
						height="200px"
						hide-delimiter-background
						show-arrows="hover"
						v-if="room.photos.length > 0"
					>
						<v-carousel-item
							v-for="photo of getRoomPhoto(room.id)"
							:src="photo.urlFull"
							cover
						></v-carousel-item>
					</v-carousel>
					<div class="room__info">
						<h3 class="room__title">{{room.name}}</h3>
						<div class="room__amenities">
							<span
								v-for="(amenity, index) of room.amenities"
								:class="['room__amenity', {
									'room__amenity_last': index === room.amenities.length - 1
								}]"
							>{{amenity}}</span>
						</div>
						<div class="listing-chips">
							<v-chip prepend-icon="mdi-ruler-square-compass">{{room.area}} м <sup>2</sup></v-chip>
							<v-chip prepend-icon="mdi-account-outline">{{getWordWithProperEnding(room.places, 'место')}}</v-chip>
							<v-chip>{{getRoomString(room.badCount)}}</v-chip>
						</div>
						<div class="room__order order">
							<div class="order__info">
								<div class="order__price" v-if="room.totalPrice">
									<div class="price">{{room.totalPrice?.toLocaleString('ru-RU')}} ₽</div>
									<span class="order__price_info">Цена за {{formatDays(listing.daysCount)}}</span>
								</div>
								<div class="order__price" v-else>
									<div class="price">от {{room.dailyPrice?.toLocaleString('ru-RU')}} ₽</div>
									<span class="order__price_info">Цена за 1 ночь</span>
								</div>
							</div>
							<v-btn
								class="order__btn"
								color="#7059FF"
								:variant="chosenRoomId === room.id ? 'tonal' : 'elevated'"
								@click="chosenRoomId = room.id"
								:prepend-icon="chosenRoomId === room.id ? 'mdi-check' : ''"
							>
								{{chosenRoomId === room.id ? 'Выбран' : 'Выбрать'}}
							</v-btn>
						</div>
					</div>
				</div>
				
				
			</v-card>
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

.rooms__title {
	margin-bottom: 16px;
}

.room {
	&.no-photos &__main {
		display: block !important;
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