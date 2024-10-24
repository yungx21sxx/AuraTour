<script setup lang="ts">
	import type {IListingPreviewResponse} from "~/types/response.types";
	import useBooking from "~/modules/Booking/composables/useBooking";
	import {getWordWithProperEnding} from "~/utils/utils";
	import useFavorites from "~/components/pages/Favorites/useFavorites";
	
	const {listing} = defineProps<{
		listing: IListingPreviewResponse,
		mobile?: boolean
	}>();
	
	const {getBookingQueryLinkParameters} = useBooking();
	const {addToFavorites, removeFromFavorites, favoriteListingIDs} = useFavorites()
	
	
	const inFavorite = computed(() => {
		return favoriteListingIDs.value.includes(listing.id)
	})
	
	
	async function goToListing() {
		await navigateTo({
			name: 'listing-id',
			params: {id: listing.id},
			query: {...getBookingQueryLinkParameters.value},
		})
	}
</script>

<template>
	<v-card
		:class="['listing', {
			'listing_mobile': mobile
		}]"
		elevation="0"
		:key="listing.id"
	>
		<v-carousel
			class="listing__carousel"
			hide-delimiter-background
			hide-delimiters
			show-arrows="hover"
			color="rgba(0,0,0,0)"
		>
			<v-btn class="carousel__btn"
			       icon="mdi-heart-outline"
			 
			       color="rgba(255,255,255,.7)"
			       v-if="!inFavorite"
			       @click="addToFavorites(listing.id)"
			></v-btn>
			<v-btn class="carousel__btn"
			       icon="mdi-heart"
		
			       color="rgba(255,255,255,.7)"
			       v-else
			       @click="removeFromFavorites(listing.id)"
			></v-btn>
			<v-carousel-item
				v-for="photo of listing.photos"
			>
				<v-img @click.stop="goToListing" :src="photo" cover height="100%"/>
			</v-carousel-item>
		</v-carousel>
		<div class="listing__info info">
			<h3 class="info__title " @click="goToListing">{{listing.title}}</h3>
			<v-chip variant="text" prepend-icon="mdi-map-marker" class="listing__address">{{listing.address}}</v-chip>
			<p class="info__city">{{listing.city}}, {{listing.seaDistance}} м до моря</p>
			<div class="info__adv mt-2" v-if="!listing.isHotelType">
				<v-chip color="blue" prepend-icon="mdi-bed">{{getWordWithProperEnding( listing.places, 'место')}}</v-chip>
				<v-chip color="blue" prepend-icon="mdi-ruler-square-compass">{{listing.area}} м<sup>2</sup></v-chip>
				<v-chip color="blue">{{getRoomString(listing.badCount)}}</v-chip>
<!--				<v-chip color="blue" class="chip-reviews">Нет отзывов</v-chip>-->
			</div>
			<div class="listing__amenities mt-4">
				<span
					v-for="(amenity, index) of listing.amenities"
					:class="['listing__amenity', {
						'listing__amenity_last': index === listing.amenities.length - 1
					}]"
				>{{amenity}}</span>
			</div>
<!--			<p class="info__reviews" v-if="listing.reviewCount === 0">Нет отзывов</p>-->
<!--			<div class="d-flex align-center" style="gap: 16px" v-else>-->
<!--				<v-chip prepend-icon="mdi-star" color="#7059FF" label >{{listing.averageRating}}</v-chip>-->
<!--				<span>{{getWordWithProperEnding( listing.reviewCount, 'отзыв')}}</span>-->
<!--			</div>-->
		</div>
		<div class="listing__order order">
			<div class="order__info" v-if="listing.totalPrice">
				<div class="order__price" v-if="listing.type !== 'guest-house' && listing.totalPrice">
					<span class="price">{{listing.dailyPrice.toLocaleString('ru-RU')}} ₽</span>
					<span class="order__price_info">за сутки</span>
				</div>
				<div class="order__price" v-else>
					<div class="price">от {{listing.dailyPrice.toLocaleString('ru-RU')}} ₽</div>
					<span class="order__price_info">за сутки</span>
				</div>
				<p class="order__description" v-if="listing.type !== 'guest-house' && listing.totalPrice">Всего {{listing.totalPrice.toLocaleString('ru-RU')}} ₽</p>
			</div>
			<div class="order__info" v-else>
				<div class="order__price">
					<span class="price">от {{listing.dailyPrice.toLocaleString('ru-RU')}} ₽</span>
					<span class="order__price_info">за сутки</span>
				</div>
			</div>
			<v-btn class="order__btn" color="#7059FF" @click="goToListing">Выбрать</v-btn>
		</div>
	</v-card>

</template>

<style scoped lang="scss">
	
	.carousel__btn {
		position: absolute;
		z-index: 2;
		right: 8px;
		top: 8px;
	}
	
	.chip-reviews {
		display: none;
	}
	.listing {
		display: grid;
		grid-template-columns: 2fr 3fr 1.5fr;
		margin-bottom: 16px;
		&__address {
			color: $text-gray;
			margin-left: -10px;
		}
		&__info, &__order {
			margin: 12px;
		}
		&__carousel {
			height: 220px !important;
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
			font-size: 12px;
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
	
	.info {
		margin-left: 20px;
		
		
		&__address, &__reviews {
			color: $text-gray;
		}
		
		&__adv {
			display: flex;
			flex-wrap: wrap;
			gap: 8px;
			
		}
	}
	
	.order {
		display: flex;
		flex-direction: column;
		border-left: 1px solid $light-gray;
		padding-left: 16px;
		
		&__btn {
			margin-top: auto;
			margin-bottom: 16px;
			width: 100%;
		}
		&__description {
			color: #717171;
		}
		&__price {
			margin-bottom: 4px;
			.price {
				font-size: 18px;
				font-weight: 600;
				margin-right: 6px;
			}
			
			&_info {
				font-size: 14px;
			}
			
		}
	}
	.listing_mobile {
		display: block;
		width: 340px;
		
		
		.info {
			margin-bottom: 16px !important;
			&__title {
				font-size: 16px;
			}
			&__address, &__city {
				font-size: 14px;
			}
			&__reviews {
				display: none;
			}
		}
		.order {
			border-left: none !important;
			padding-left: 0 !important;
			flex-direction: row !important;
			justify-content: space-between;
			align-items: center !important;
			margin-left: 20px !important;
			margin-right: 20px !important;
			margin-bottom: 16px !important;
			&__btn {
				width: fit-content !important;
				margin-bottom: 0 !important;
				margin-top: 0 !important;
			}
		}
		.chip-reviews {
			display: flex !important;
		}
	}
	@media screen and (max-width: 630px) {
		.listing {
			display: block !important;
			&__amenities {
				display: none;
			}
			&__carousel {
				height: 190px !important;
			}
		}
		
		.info {
			margin-bottom: 16px !important;
			&__title {
				font-size: 16px;
			}
			&__address, &__city {
				font-size: 14px;
			}
			&__city {
				margin-bottom: 8px;
			}
			&__reviews {
				display: none;
			}
		}
		.order {
			border-left: none !important;
			padding-left: 0 !important;
			flex-direction: row !important;
			justify-content: space-between;
			align-items: center !important;
			margin-left: 20px !important;
			margin-right: 20px !important;
			margin-bottom: 16px !important;
			&__btn {
				width: fit-content !important;
				margin-bottom: 0 !important;
				margin-top: 0 !important;
			}
		}
		.chip-reviews {
			display: flex !important;
		}
		
		
	}

</style>