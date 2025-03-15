<template>
	<v-dialog
		fullscreen
		v-model="currentPhoto.modal"
		@close="closeModal"
	>
		
		<v-card  border="0" style="height: 80svh;" color="black">
			<GalleryToolbar @on-close="closeModal" color="black"/>
			<div class="img-preview__wrapper">
				<client-only>
					<swiper
						:spaceBetween="16"
						:navigation="true"
						:zoom="true"
						:style="{
					        '--swiper-navigation-color': '#7059FF',
					        '--swiper-pagination-color': '#7059FF',
			            }"
						:pagination="{
	                        type: 'fraction',
	                    }"
						:lazy="true"
						@swiper="getSwiperInstance"
						:thumbs="{ swiper: thumbsSwiper }"
						:modules="[Zoom, Pagination, Navigation, Scrollbar, Thumbs, Virtual]"
						:virtual="true"
						class="img-preview"
					>
						<swiper-slide
							v-for="(photo, index) in  photos"
							:key="photo.id"
							class="img-preview__slide"
							:virtualIndex="index"
						>
							<div class="swiper-zoom-container">
								<img
									loading="lazy"
									:alt="listing.title"
									class="img-preview__img"
									:src="photo.urlFull"
									@load="(e) => e.target.classList.add('loaded')"
								/>
								<div class="swiper-lazy-preloader"></div>
							</div>
						</swiper-slide>
					</swiper>
				</client-only>
				<swiper
					@swiper="setThumbsSwiper"
					:spaceBetween="10"
					:slides-per-view="'auto'"
					:modules="[Zoom, Pagination, Navigation, Scrollbar, Thumbs, FreeMode]"
					:freeMode="true"
					:watchSlidesProgress="true"
					class="img-preview__thumbs"
				>
					<swiper-slide class="img-preview__thumbs__slide" v-for="photo of photos">
						<v-img cover :alt="listing.title"  class="thumbs__img" :src="photo.urlMin" />
					</swiper-slide>
				</swiper>
			</div>
		</v-card>
	</v-dialog>
</template>
<script setup lang="ts">

import useGallery from "~/modules/Listing/composables/useGallery";
import {mdiChevronLeft, mdiHeartOutline, mdiShareVariant} from "@mdi/js";
import GalleryToolbar from "~/modules/Listing/components/Gallery/GalleryToolbar.vue";
import useListing from "~/modules/Listing/composables/useListing";
import { Swiper, SwiperSlide  } from 'swiper/vue';
import {Scrollbar, FreeMode, Thumbs, Pagination, Navigation, Zoom, Virtual} from 'swiper/modules';


import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import 'swiper/css/zoom';
import 'swiper/css/virtual';


const {currentPhoto} = useGallery()

const {listing} = useListing();



const swiperController = ref<Swiper>();
const thumbsSwiper = ref<Swiper>();

const getSwiperInstance = (swiper: Swiper) => {
	swiperController.value = swiper;
}


const setThumbsSwiper = (swiper: Swiper) => {
	thumbsSwiper.value = swiper;
};

const closeModal = () => {
	if (!currentPhoto.value.room) {
		currentPhoto.value.index = swiperController.value.activeIndex
	}
	currentPhoto.value.room = null;
	currentPhoto.value.modal = false;
}


const photos = computed(() => {
	if (currentPhoto.value.room) {
		return listing.value.rooms.find(room => room.id === currentPhoto.value.room?.roomId).photos;
	}
	return listing.value.photos;
})

//Срабаьывает в момент открытия и закрытия модального окна
watch(currentPhoto, () => {
	setTimeout(() => {
		if (swiperController.value) {
			const currentPhotoIndex = currentPhoto.value.room ? currentPhoto.value.room.photoIndex : currentPhoto.value.index;
			swiperController.value.slideTo(currentPhotoIndex, 0)
		}
	},0)
}, {
	deep: true
})




</script>


<style lang="scss">



.img-preview {
	height: calc(100dvh - 62px - 100px);
	width: 100%;
	
	&__wrapper {
		display: flex;
		gap: 16px;
		flex-direction: column;
		height: 100%;
		flex-grow: 1;
	}
	
	&__img {
		
		height: 100%;

	}
	
	
}

.img-preview__img {
	opacity: 0;
	transition: opacity 0.5s ease-in-out;
}

.img-preview__img.loaded {
	opacity: 1;
}
.swiper-slide-thumb-active .thumbs__img {
	border: 2px solid $accent-blue;
}

.img-preview__thumbs {
	
	margin: 0 8px;
	box-sizing: border-box;
}


.swiper-pagination-fraction {
	color: #FFFFFF;
}

.img-preview__thumbs__slide {
	width: 90px;
	height: 65px;
}
.thumbs__img {
	border-radius: 10px;
	border: 2px solid rgba(0,0,0,0);
	width: 90px;
	height: 62px;
	object-fit: cover;
}


.btns {
	
	display: flex;
	align-items: center;
	gap: 16px;
	
}
</style>