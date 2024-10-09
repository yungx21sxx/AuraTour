<template>
	<swiper
		:slidesPerView="'auto'"
		:spaceBetween="20"
		:navigation="true"
		:scrollbar="{
	        hide: true,
	    }"
		:modules="modules"
		@swiper="getSwiperInstance"
		class="swiper-multiply"
	>
		<swiper-slide
			v-for="photo of photos"
			class="swiper-multiply__slide"
		>
			<img class="swiper-multiply__img" :src="photo" alt="ЖК Ривер Плаза Сочи"/>
		</swiper-slide>
		
	</swiper>
	<div class="swiper-multiply__footer">
		<div class="btns">
			<v-btn @click="swiperController.slidePrev()" icon variant="tonal"><v-icon size="large">mdi-arrow-left</v-icon></v-btn>
			<v-btn @click="swiperController.slideNext()" icon variant="tonal"><v-icon size="large">mdi-arrow-right</v-icon></v-btn>
		</div>
		
		<div class="action">
			<slot name="action"/>
		</div>
	</div>
	
	

</template>
<script setup lang="ts">
// Import Swiper Vue.js components
	import { Swiper, SwiperSlide } from 'swiper/vue';
	import { Scrollbar } from 'swiper/modules';
	
	const swiperController = ref();
	
	//@ts-ignore
	const getSwiperInstance = (swiper) => {
		swiperController.value = swiper;
	}
	
	
	
	
	defineProps<{
		photos: string[]
	}>()
	
	// Import Swiper styles
	import 'swiper/css';
	
	import 'swiper/css/pagination';
	import 'swiper/css/navigation'
	
	// import required modules
	import { Pagination, Navigation } from 'swiper/modules';
	
	const modules = [Pagination, Navigation, Scrollbar]
</script>


<style lang="scss">
	.action {
		margin-left: auto;
		@media screen and (max-width: 370px){
			margin-left: 0;
		}
	}
	.swiper-button-next:after, .swiper-button-prev:after  {
	    color: $accent-blue;
		padding: 16px;
	}
	
	//.swiper-multiply {
	//	height: 400px;
	//	max-width: 750px;
	//
	//	@media screen and (max-width: 500px) {
	//		height: 300px;
	//
	//		&__img {
	//			height: 300px !important;
	//		}
	//	}
	//
	//	&__slide {
	//		width: fit-content;
	//		display: flex;
	//		justify-content: center;
	//		align-items: center;
	//	}
	//
	//	&__img {
	//		display: block;
	//		height: 400px;
	//	}
	//
	//	&__footer {
	//
	//		@media screen and (max-width: 370px){
	//			flex-direction: column;
	//			align-items: flex-start;
	//		}
	//		display: flex;
	//		align-items: center;
	//		gap: 16px;
	//		margin-top: 16px;
	//	}
	//
	//}
	
	.btns {
		
		display: flex;
		align-items: center;
		gap: 16px;
		
	}
</style>