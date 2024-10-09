<template>
	<div class="gallery">
		<swiper
			:spaceBetween="16"
			:navigation="true"
			:style="{
		      '--swiper-navigation-color': '#fff',
		      '--swiper-pagination-color': '#fff',
	         }"
			:pagination="{
                type: 'fraction',
            }"
			@swiper="getSwiperInstance"
			:thumbs="{ swiper: thumbsSwiper }"
			:modules="modules"
			class="swiper-multiply"
		>
			<swiper-slide
				v-for="photo of listingPhotos"
				class="swiper-multiply__slide"
			>
				<v-card>
					<v-img cover :alt="listing.title"  class="swiper-multiply__img" :src="photo.urlFull" />
				</v-card>
			</swiper-slide>
		</swiper>
		<swiper
			@swiper="setThumbsSwiper"
			:spaceBetween="10"
			:slides-per-view="'auto'"
			:modules="modules"
			:freeMode="true"
			:watchSlidesProgress="true"
			class="thumbs"
		>
			<swiper-slide class="thumbs__slide" v-for="photo of listingPhotos">
			
				<v-img cover :alt="listing.title"  class="thumbs__img" :src="photo.urlMin" />
				
			</swiper-slide>
			
			
		</swiper>
	</div>
	

	

</template>
<script setup lang="ts">
// Import Swiper Vue.js components
	import { Swiper, SwiperSlide  } from 'swiper/vue';
	import { Scrollbar, FreeMode, Thumbs } from 'swiper/modules';
	import useListing from "~/components/pages/Listing/useListing";


	import 'swiper/css';
	
	import 'swiper/css/free-mode';
	import 'swiper/css/navigation';
	import 'swiper/css/thumbs';
	
	// import required modules
	import { Pagination, Navigation } from 'swiper/modules';
	import type {IPhoto} from "~/types/response.types";
	
	const modules = [Pagination, Navigation, Scrollbar, Thumbs, FreeMode]


	const {listingPhotos, listing} = useListing();
	
	const swiperController = ref();
	//@ts-ignore
	const getSwiperInstance = (swiper) => {
		swiperController.value = swiper;
	}

	const thumbsSwiper = ref();
	
	//@ts-ignore
	const setThumbsSwiper = (swiper) => {
		thumbsSwiper.value = swiper;
	};
	

	
</script>


<style lang="scss">
	.action {
		margin-left: auto;
		@media screen and (max-width: 370px){
			margin-left: 0;
		}
	}
	//.swiper-button-next:after, .swiper-button-prev:after {
	//    color: $accent-blue;
	//	padding: 16px;
	//}
	.gallery {
		max-width: 750px;
		margin-bottom: 16px;
	}
	.swiper-multiply {
		height: 450px;
		width: 100%;
		@media screen and (max-width: 500px) {
			height: 300px;

			&__img {
				height: 300px !important;
			}
		}
		
		//&__slide {
		//	width: fit-content;
		//	display: flex;
		//	justify-content: center;
		//	align-items: center;
		//}

		&__img {
			
			height: 450px;
			border-radius: 10px;
		}
		
		
	}
	.swiper-slide-thumb-active .thumbs__img {
		border: 2px solid $accent-blue;
	}
	
	.thumbs {
		margin-top: 16px;
		width: 100%;
		box-sizing: border-box;
	}

	.swiper-pagination-fraction {
		color: #FFFFFF;
	}
	
	.thumbs__slide {
		width: 100px;
		height: 65px;
	}
	.thumbs__img {
		border-radius: 10px;
		border: 2px solid rgba(0,0,0,0);
		width: 100px;
		height: 60px;
		//object-fit: cover;
	}

	
	.btns {
		
		display: flex;
		align-items: center;
		gap: 16px;
		
	}
</style>