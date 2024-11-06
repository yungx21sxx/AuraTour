<script setup lang="ts">

import type {IListingPreviewResponse} from "~/types/response.types";
import {mdiMapMarker, mdiCircleSmall}  from "@mdi/js";

const {listing} = defineProps<{
	listing: IListingPreviewResponse,
}>();


</script>

<template>
	<NuxtLink class="listing" elevation="0" :href="`/listing/${listing.id}`">
		<v-img class="listing__photo" cover :src="listing.photos[0]"/>
		<div class="listing__info">
			<div class="listing__title">{{listing.title}}</div>
			<v-chip variant="text" :prepend-icon="mdiMapMarker" class="listing__city" color="#818487">{{listing.city}}, {{listing.seaDistance}} м до моря</v-chip>
<!--			<div class="listing__advs" v-if="!listing.isHotelType">-->
<!--				<span class="listing__adv">{{getWordWithProperEnding( listing.places, 'место')}}</span>-->
<!--				<span class="listing__adv">{{listing.area}} м<sup>2</sup></span>-->
<!--				<span class="listing__adv listing__adv_last">{{getRoomString(listing.badCount)}}</span>-->
<!--			</div>-->
			<div class="listing__price price">
				<span class="price__value">
					от {{listing.minPrice.toLocaleString('ru-RU')}} ₽
				</span>
				<v-icon :icon="mdiCircleSmall" color="#818487"/>
				<span class="price__desc">
					в сутки
				</span>
			</div>
		</div>
		
	</NuxtLink>
</template>

<style scoped lang="scss">

	.listing {
		width: 280px;
		color: $text-main;
		&__advs {
			display: flex;
			flex-wrap: wrap;
			margin-bottom: 16px;
		}
		&__adv {
			color: $text-main;
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
		&__photo {
			height: 170px;
			border-radius: 16px;
		}
		&__info {
			margin-top: 12px;
		}
		&__title {
			font-size: 18px;
			margin-bottom: 4px;
			overflow:hidden;
			white-space:nowrap;
			text-overflow: ellipsis;
		}
		&__city {
			color: $text-gray;
			margin-bottom: 12px;
			margin-left: -10px;
		}
		&__price {
			display: flex;
			margin-bottom: 8px;
			gap: 4px;
		}
	}
	
	.price {
		&__value {
			font-weight: 600;
			
		}
		
		&__desc {
			color: #6a6d81;
			font-weight: 400;
			line-height: 24px;
			display: flex;
			align-items: center;
			
			
		}
	}
	

</style>