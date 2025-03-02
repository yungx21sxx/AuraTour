<script setup lang="ts">

import type {IListingPreviewResponse} from "~/types/response.types";
import {mdiMapMarker, mdiCircleSmall}  from "@mdi/js";

const {listing} = defineProps<{
	listing: IListingPreviewResponse,
}>();


</script>

<template>
	<NuxtLink class="listing" elevation="0" :href="`/listing/${listing.id}`"
	          itemscope itemtype="https://schema.org/RealEstateListing">
		
		<!-- Фото -->
		<v-img class="listing__photo" cover :src="listing.photos[0]" itemprop="image"/>
		
		<div class="listing__info">
			<!-- Название объекта -->
			<div class="listing__title" itemprop="name">{{ listing.title }}</div>
			
			<!-- Город и расстояние до моря -->
			<v-chip
				variant="text"
				:prepend-icon="mdiMapMarker"
				class="listing__city"
				color="#818487"
				itemprop="address"
				itemscope itemtype="https://schema.org/PostalAddress">
				<span itemprop="addressLocality">{{ listing.city }}</span>,
				<span>{{ listing.seaDistance }} м до моря</span>
			</v-chip>
			
			<!-- Цена -->
			<div class="listing__price price">
            <span class="price__value" itemprop="price">
                от {{ listing.minPrice.toLocaleString('ru-RU') }} ₽
            </span>
				<meta itemprop="priceCurrency" content="RUB"/>
				<v-icon :icon="mdiCircleSmall" color="#818487"/>
				<span class="price__desc">в сутки</span>
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