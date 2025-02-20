<template>
	<swiper
		:slidesPerView="'auto'"
		:spaceBetween="16"
		:pagination="{
            dynamicBullets: true,
        }"
		:free-mode="true"
		:modules="modules"
		@swiper="getSwiperInstance"
		class="listings-swiper"
	>
		<swiper-slide
			v-for="listing of listings"
			class="listings-swiper__slide"
			:style="{
				paddingBottom: '32px'
			}"
		>
			<ListingItemSmall class="listings-swiper__listing" :listing="listing" mobile/>
		</swiper-slide>
	
	</swiper>
	<div class="listings-swiper__footer">
		
		<div class="action">
			<slot name="action"/>
		</div>
		<div class="btns" >
			<v-btn @click="swiperController.slidePrev()" color="#7059FF" :icon="mdiArrowLeft" variant="tonal" aria-label="Влево"></v-btn>
			<v-btn @click="swiperController.slideNext()" color="#7059FF" :icon="mdiArrowRight" variant="tonal" aria-label="Вправо"></v-btn>
		</div>
	</div>
</template>
<script setup lang="ts">
// Import Swiper Vue.js components
	import {Swiper, SwiperSlide} from "swiper/vue";
// Import Swiper styles
	import 'swiper/css';
	
	import 'swiper/css/pagination';
	import 'swiper/css/navigation';
	import 'swiper/css/free-mode';
	
	// import required modules
	import {mdiArrowLeft, mdiArrowRight} from "@mdi/js"
	import type {IListingPreviewResponse} from "~/types/response.types";
	import ListingItemSmall from "~/modules/Listing/components/shared/ListingItemSmall.vue";
	import {FreeMode, Navigation, Pagination} from "swiper/modules";
	const {isMobile} = useDevice()
	
	const swiperController = ref();
	
	//@ts-ignore
	const getSwiperInstance = (swiper) => {
		swiperController.value = swiper;
	}
	
	defineProps<{
		listings: IListingPreviewResponse[]
	}>()
	
	const modules = [Pagination, Navigation, FreeMode]
</script>


<style lang="scss">

.swiper-button-next:after, .swiper-button-prev:after  {
	color: $accent-blue;
	padding: 16px;
}

.listings-swiper {
	
	
	&__slide {
		width: fit-content !important;
		display: flex !important;
		justify-content: center !important;
		align-items: center !important;
	}
	
	&__img {
		display: block;
		height: 400px;
	}
	
	&__footer {
		
		margin-top: 16px;
	}
	
	&__footer {
		
		
		display: flex;
		align-items: center;
		gap: 16px;
		margin-top: 16px;
	}
	
}

.btns {
	
	display: flex;
	align-items: center;
	gap: 16px;
	
}
</style>