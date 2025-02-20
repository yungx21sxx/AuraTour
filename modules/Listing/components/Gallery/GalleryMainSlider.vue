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
			:modules="[Pagination, Navigation, Scrollbar, Thumbs, FreeMode]"
			class="swiper-multiply"
		>
			<swiper-slide
				v-for="photo of listing.photos"
				class="swiper-multiply__slide"
				@click="openGalleryModal(photo.id)"
			>
				<v-card>
					<v-img cover :alt="listing.title"  class="swiper-multiply__img" :src="photo.urlFull" >
						<v-btn color="#FFFF" @click="openGalleryModal(photo.id)" variant="flat"  class="gallery__btn1" :icon="mdiFullscreen"></v-btn>
					</v-img>
				</v-card>
			</swiper-slide>
		</swiper>
	</div>

	
</template>

<script setup lang="ts">
// Import Swiper Vue.js components
	import { Swiper, SwiperSlide  } from 'swiper/vue';
	import { Scrollbar, FreeMode, Thumbs, Pagination, Navigation } from 'swiper/modules';

	import {mdiFullscreen} from "@mdi/js";

	import 'swiper/css';
	
	import 'swiper/css/free-mode';
	import 'swiper/css/navigation';
	import 'swiper/css/thumbs';
	import useGallery from "~/modules/Listing/composables/useGallery";
	import useListing from "~/modules/Listing/composables/useListing";
	
	const {currentPhoto} = useGallery()
	
	function openGalleryModal(index: number) {
		currentPhoto.value.index = index;
		currentPhoto.value.room = null;
		currentPhoto.value.modal = true;
	}
	
	const {listing} = useListing();
	
	
	const swiperController = ref();
	//@ts-ignore
	const getSwiperInstance = (swiper) => {
		swiperController.value = swiper;
	}


	//Срабаьывает в момент открытия и закрытия модального окна
	watch(currentPhoto, () => {
		swiperController.value.slideTo(currentPhoto.value.index, 0)
	}, {
		deep: true
	})


	
</script>


<style lang="scss">

	.swiper-button-next:after, .swiper-button-prev:after {
	    color: #FFFFFF !important;
		padding: 16px;
	}
	.swiper-pagination-fraction {
		color: #FFFFFF !important;
	}
	.actions {
		position: relative;
		height: 100%;
		
	}
	.gallery {
		display: grid;
		margin-bottom: 16px;
		position: relative;
		&__btn1 {
			position: absolute;
			right: 16px;
			top: 16px;
			z-index: 10;
		}
		
		@media screen  and (max-width: 630px){
			
			margin: 20px -16px;
		}
	}
	.swiper-multiply {
		width: 100%;
		height: 450px;
		@media screen and (max-width: 500px) {
			height: 300px;

			&__img {
				height: 300px !important;
			}
		}
		
		&__slide {
			width: 100%;
			cursor: zoom-in;
		}

		&__img {
			width: 100%;
			height: 450px;
			border-radius: 10px;
			@media screen  and (max-width: 630px){
				border-radius: 0;
			}
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
		width: 90px;
		height: 65px;
	}
	.thumbs__img {
		border-radius: 10px;
		border: 2px solid rgba(0,0,0,0);
		width: 85px;
		height: 60px;
		//object-fit: cover;
	}

	
	.btns {
		
		display: flex;
		align-items: center;
		gap: 16px;
		
	}
</style>