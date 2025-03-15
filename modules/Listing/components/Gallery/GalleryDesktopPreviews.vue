<template>
	<swiper
		slidesPerView="auto"
		:navigation="true"
		:scrollbar="{
	        enabled: true,
	        // dragClass: 'swiper-multiply__scrollbar',
	        draggable: true,
	        dragSize: isMobile ? 40 : 'auto'
	    }"
		:mousewheel="{ forceToAxis: true }"
		:free-mode="{
			enabled: !isMobile
		}"
		:lazy="true"
		:modules="modules"
		@swiper="getSwiperInstance"
		class="swiper-multiply"
	>
		<swiper-slide
			v-for="(photo, index) in listing.photos"
			:key="photo.id"
			class="swiper-multiply__slide"
			@click="openGalleryModal(photo.id)"
			:virtualIndex="index"
		>
			<img
				class="swiper-multiply__img swiper-multiply__img--fixed"
				:src="photo.urlFull"
				loading="lazy"
				:alt="listing.title + '| Аура Тур'"
			>
		</swiper-slide>
	
	</swiper>
	<div class="swiper-multiply__footer">
		<div class="btns">
			<v-btn  aria-label="Left" @click="swiperController.slidePrev()" :icon="mdiArrowLeft" variant="tonal"></v-btn>
			<v-btn  aria-label="Right" @click="swiperController.slideNext()" :icon="mdiArrowRight" variant="tonal"></v-btn>
		</div>
		
		<div class="action">
			<BtnPrimary class="gallery__btn" :prepend-icon="mdiImage" @click="galleyThumbsModalIsOpen = true">Показать все фото</BtnPrimary>
		</div>
	</div>

</template>

<script setup lang="ts">
// Import Swiper Vue.js components
import { Swiper, SwiperSlide  } from 'swiper/vue';
import {Scrollbar, FreeMode, Thumbs, Pagination, Navigation, Virtual} from 'swiper/modules';

import {mdiArrowLeft, mdiArrowRight, mdiFullscreen, mdiImage, mdiViewGallery} from "@mdi/js";

import 'swiper/css';

import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/free-mode';
import 'swiper/css/scrollbar';
import useGallery from "~/modules/Listing/composables/useGallery";
import useListing from "~/modules/Listing/composables/useListing";
import BtnPrimary from "~/modules/Common/UI/BtnPrimary.vue";
import BtnSecondary from "~/modules/Common/UI/BtnSecondary.vue";


const {isMobile} = useDevice();

const {currentPhoto, galleyThumbsModalIsOpen} = useGallery()
const modules = [Pagination, Navigation, Scrollbar, FreeMode, Scrollbar]

function openGalleryModal(index: number) {
	currentPhoto.value.index = index;
	currentPhoto.value.room = null;
	currentPhoto.value.modal = true;
}

const {listing} = useListing();


const swiperController = ref();
const getSwiperInstance = (swiper) => {
	swiperController.value = swiper;
}

watch(() => currentPhoto.value.index, (newIndex) => {
	if (swiperController.value && newIndex !== null) {
		swiperController.value.slideTo(newIndex);
	}
});



</script>


<style lang="scss">
.action {
	margin-left: auto;
	@media screen and (max-width: 370px){
		margin-left: 0;
	}
}

.swiper-multiply__img {
	will-change: transform;
}
.swiper-container {
	transform: none !important;
}

.swiper-horizontal > .swiper-scrollbar, .swiper-scrollbar.swiper-scrollbar-horizontal {
	height: 10px !important;
}

.swiper-button-next:after, .swiper-button-prev:after,  {
	color: white !important;
	padding: 16px;
}
.swiper-multiply {
	height: 450px;
	border-radius: 10px;
	.swiper-scrollbar-drag {
		background: rgba(white, .9) !important;
		height: 10px !important;
	}
	
	&__slide {
		width: fit-content !important;
		display: flex !important;
		aspect-ratio: 1/1 !important;
		justify-content: center !important;
		align-items: center !important;
		&:not(:last-child) {
			margin-right: 16px !important;
		}
	}
	
	&__img {
		display: block;
		height: 100%;
		object-fit: cover;
		aspect-ratio: 1/1 !important;
		&--fixed {
			object-fit: cover;
			aspect-ratio: 1/1;
		}

		
	}
	
	&__footer {
		
		@media screen and (max-width: 370px){
			flex-direction: column;
			align-items: flex-start;
		}
		display: flex;
		align-items: center;
		gap: 16px;
		margin-top: 16px;
	}
	
	@media screen and (max-width: 500px) {
		height: 320px;
		width: calc(100vw - 32px);
		&__img {
			//height: 300px !important;
			width: calc(100vw - 32px);
			object-fit: cover !important;
		}
	}
	
}

.btns {
	
	display: flex;
	align-items: center;
	gap: 16px;
	
}
</style>