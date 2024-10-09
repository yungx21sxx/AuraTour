<template>
	<swiper
		:slidesPerView="'auto'"
		:spaceBetween="16"
		:pagination="{
            dynamicBullets: true,
        }"
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
		<div class="btns" v-if="!isMobile">
			<v-btn @click="swiperController.slidePrev()" color="#7059FF" icon="mdi-arrow-left" variant="tonal"></v-btn>
			<v-btn @click="swiperController.slideNext()" color="#7059FF" icon="mdi-arrow-right" variant="tonal"></v-btn>
		</div>
	</div>



</template>
<script setup lang="ts">
// Import Swiper Vue.js components
	
	// Import Swiper styles
	import 'swiper/css';
	
	import 'swiper/css/pagination';
	import 'swiper/css/navigation'
	
	// import required modules

	import type {IListingPreviewResponse} from "~/types/response.types";
	const {isMobile} = useDevice()
	
	const swiperController = ref();
	
	//@ts-ignore
	const getSwiperInstance = (swiper) => {
		swiperController.value = swiper;
	}
	
	defineProps<{
		listings: IListingPreviewResponse[]
	}>()
	
	const modules = [SwiperPagination, SwiperNavigation]
</script>


<style lang="scss">

.swiper-button-next:after, .swiper-button-prev:after  {
	color: $accent-blue;
	padding: 16px;
}

.listings-swiper {
	
	
	&__slide {
		width: fit-content;
		display: flex;
		justify-content: center;
		align-items: center;
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