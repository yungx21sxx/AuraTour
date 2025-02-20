<template>
	<v-dialog
		fullscreen
		v-model="currentPhoto.modal"
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
						@swiper="getSwiperInstance"
						:thumbs="{ swiper: thumbsSwiper }"
						:modules="[Zoom, Pagination, Navigation, Scrollbar, Thumbs, FreeMode]"
						class="img-preview"
						@slide-change="onSlideChange"
					>
						<swiper-slide
							v-for="photo of photos"
							class="img-preview__slide"
						>
							<div class="swiper-zoom-container">
								<img loading="lazy" :alt="listing.title"  class="img-preview__img" :src="photo.urlFull" />
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
import { Scrollbar, FreeMode, Thumbs, Pagination, Navigation, Zoom } from 'swiper/modules';


import 'swiper/css';



const {currentPhoto} = useGallery()

const {listing} = useListing();


const swiperController = ref();
const thumbsSwiper = ref();
//@ts-ignore
const getSwiperInstance = (swiper) => {
	swiperController.value = swiper;
}
//
// onMounted(() => {
// 	const swiper = useSwiper();
// 	//@ts-ignore
// 	swiper.on('zoomChange', (_,scale) => {
// 		if (scale > 1) {
// 			swiper.allowSlideNext = false;
// 			swiper.allowSlidePrev = false;
// 		} else {
// 			swiper.allowSlideNext = true;
// 			swiper.allowSlidePrev = true;
// 		}
// 	})
// })

const onZoomChange =  (swiper, scale) => {
	if (scale > 1) {
		swiper.allowSlideNext = false;
		swiper.allowSlidePrev = false;
	} else {
		swiper.allowSlideNext = true;
		swiper.allowSlidePrev = true;
	}
}


//@ts-ignore
const setThumbsSwiper = (swiper) => {
	thumbsSwiper.value = swiper;
};

const closeModal = () => {
	currentPhoto.value.room = null;
	currentPhoto.value.modal = false;
}

//@ts-ignore
const onSlideChange = (swiper) => {
	if (!currentPhoto.value.room)
		currentPhoto.value.index = swiper.activeIndex
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
		const currentPhotoIndex = currentPhoto.value.room ? currentPhoto.value.room.photoIndex : currentPhoto.value.index;
		swiperController.value.slideTo(currentPhotoIndex, 0)
	}, 100)
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
.img-preview__thumbs__img {
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