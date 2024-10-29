<script setup lang="ts">
	import type {IListingPreviewResponse} from "~/types/response.types";
	import useBooking from "~/modules/Booking/composables/useBooking";
	import {getWordWithProperEnding} from "~/utils/utils";
	import useFavorites from "~/components/pages/Favorites/useFavorites";
	import {mdiHeartOutline, mdiHeart, mdiMapMarker, mdiBed} from '@mdi/js'
	import BedIcon from "~/modules/Listing/icons/BedIcon.vue";
	import FitIcon from "~/modules/Listing/icons/FitIcon.vue";
	import RoomsIcon from "~/modules/Listing/icons/RoomsIcon.vue";
	import BtnPrimary from "~/modules/Common/UI/BtnPrimary.vue";
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
	<div
		:class="['listing', {
			'listing_mobile': mobile
		}]"
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
			       :icon="mdiHeartOutline"
			       density="comfortable"
			       color="rgba(255,255,255,.8)"
			       v-if="!inFavorite"
			       @click="addToFavorites(listing.id)"
			></v-btn>
			<v-btn class="carousel__btn"
			       :icon="mdiHeartOutline"
			       density="comfortable"
			       color="rgba(255,255,255,.8)"
			       v-else
			       @click="removeFromFavorites(listing.id)"
			></v-btn>
			<v-carousel-item
				v-for="photo of listing.photos"
			>
				<v-img @click.stop="goToListing" :src="photo" cover/>
			</v-carousel-item>
		</v-carousel>
		<div class="listing__info info">
			<div class="info__title text-main" @click="goToListing">{{listing.title}}</div>
			<div class="listing__address">
				<v-icon size="18px" color="#7059FF" :icon="mdiMapMarker"></v-icon>
				<span>{{listing.address}}</span>
			</div>
			<p class="info__city text-main">{{listing.city}}, {{listing.seaDistance}} м до моря</p>
			<div class="info__adv" v-if="!listing.isHotelType">
				<div class="chip">
					<BedIcon/>
					<span>
						{{getWordWithProperEnding( listing.places, 'место')}}
					</span>
				</div>
				<div class="chip">
					<FitIcon/>
					<span>
						{{listing.area}} м<sup>2</sup>
					</span>
				</div>
				<div class="chip">
					<RoomsIcon/>
					<span>
						{{getRoomString(listing.badCount)}}
					</span>
				</div>
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
		<div class="listing__order order text-main">
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
					<div class="price">от {{listing.dailyPrice.toLocaleString('ru-RU')}} ₽</div>
					<div class="order__price_info">за сутки</div>
				</div>
			</div>
			<BtnPrimary class="order__btn" @click="goToListing">Выбрать</BtnPrimary>
		</div>
	</div>

</template>

<style scoped lang="scss">
	
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
		box-shadow: 0 4px 12px 0 rgba(#002446,.1) !important;
		border-radius: 16px;
		
		&__address {
			display: flex;
			align-items: center;
			gap: 4px;
			color: $text-gray;
			margin-bottom: 8px;
			font-size: 14px;
		}
		&__info, &__order {
			margin: 12px;
		}
		&__carousel {
			height: 210px !important;
			border-radius: 16px 0 0 16px !important;
		}
		&__amenities {
			display: flex;
			flex-wrap: wrap;
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
		margin-left: 16px;
		
		&__title {
			font-size: 18px;
			margin-bottom: 8px;
		}
		
		&__address, &__reviews {
			color: $text-gray;
		}
		
		 &__city {
			 font-size: 14px;
		 }
		
		&__adv {
			display: flex;
			flex-wrap: wrap;
			gap: 8px;
			margin-top: 8px;
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
				border-radius: 16px 16px 0 0 !important;
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