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
			:modules="[Pagination, Navigation, Scrollbar, Thumbs]"
			class="main-slider"
			:lazy="true"
		>
			<swiper-slide
				v-for="photo of listing.photos"
				class="main-slider__slide"
				@click="openGalleryModal(photo.id)"
			>
				<img
					loading="lazy"
					style="object-fit: cover"
					:alt="listing.title + ' | Аура Тур'"
					class="main-slider__img"
					:src="photo.urlFull"
					@load="(e) => e.target.classList.add('loaded')"
				>
				<div class="swiper-lazy-preloader"></div>
			</swiper-slide>
		</swiper>
		<div style="display: flex; justify-content: center; padding: 16px;">
			<BtnPrimary max-width="300px" width="100%" class="gallery__btn" :prepend-icon="mdiImage" @click="galleyThumbsModalIsOpen = true">Показать все фото</BtnPrimary>
		</div>
		
	</div>


</template>

<script setup lang="ts">
// Import Swiper Vue.js components
import { Swiper, SwiperSlide  } from 'swiper/vue';
import { Scrollbar, FreeMode, Thumbs, Pagination, Navigation } from 'swiper/modules';

import {mdiFullscreen, mdiImage} from "@mdi/js";

import 'swiper/css';

import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import useGallery from "~/modules/Listing/composables/useGallery";
import useListing from "~/modules/Listing/composables/useListing";
import BtnPrimary from "~/modules/Common/UI/BtnPrimary.vue";

const {currentPhoto, galleyThumbsModalIsOpen} = useGallery()

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
.main-slider {
	width: 100%;
	height: 450px;
	
	
	&__slide {
		width: 100%;
		cursor: zoom-in;
	}
	
	&__img {
		width: 100%;
		height: 100%;
		border-radius: 10px;
		object-fit: cover;
		object-position: center;
		//opacity: 0;
		transition: opacity 0.5s ease-in-out;
		
		&.loaded {
			opacity: 1;
		}
		@media screen  and (max-width: 630px){
			border-radius: 0;
		}
	}
	
	@media screen and (max-width: 500px) {
		height: 300px;
		
		&__img {
			height: 300px !important;
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