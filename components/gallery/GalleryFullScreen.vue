<template>
	<v-dialog
		width="100%"
		fullscreen
		v-model="currentPhoto.modal"
	>
		<v-toolbar density="compact" color="rgba(0,0,0,1)">
			
			<template #append>
				<v-btn style="margin-right: -16px;" @click="closeModal" icon="mdi-close" variant="text"dsf color="#ffffff"></v-btn>
			</template>
		</v-toolbar>
		<v-card color="black" border="0" style="height: 80svh">
			<div class="img-preview__wrapper">
				<client-only>
					<swiper
						:spaceBetween="16"
						:navigation="true"
						:zoom="true"
						:style="{
					        '--swiper-navigation-color': '#fff',
					        '--swiper-pagination-color': '#fff',
			            }"
						:pagination="{
	                        type: 'fraction',
	                    }"
						@swiper="getSwiperInstance"
						:thumbs="{ swiper: thumbsSwiper }"
						:modules="[SwiperZoom, SwiperPagination, SwiperNavigation, SwiperScrollbar, SwiperThumbs, SwiperFreeMode]"
						class="img-preview"
						@slide-change="onSlideChange"
						@zoom-change=""
					>
						<swiper-slide
							v-for="photo of listingPhotos"
							class="img-preview__slide"
						>
							<div class="swiper-zoom-container">
								<img  loading="lazy" :alt="listing.title"  class="img-preview__img" :src="photo.urlFull" />
							</div>
						</swiper-slide>
					</swiper>
				</client-only>
				<swiper
					@swiper="setThumbsSwiper"
					:spaceBetween="10"
					:slides-per-view="'auto'"
					:modules="[SwiperZoom, SwiperPagination, SwiperNavigation, SwiperScrollbar, SwiperThumbs, SwiperFreeMode]"
					:freeMode="true"
					:watchSlidesProgress="true"
					class="img-preview__thumbs"
				>
					<swiper-slide class="img-preview__thumbs__slide" v-for="photo of listingPhotos">
						<v-img cover :alt="listing.title"  class="thumbs__img" :src="photo.urlMin" />
					</swiper-slide>
				</swiper>
			</div>
		</v-card>
	</v-dialog>
</template>
<script setup lang="ts">

import useListing from "~/components/pages/Listing/useListing";
import useCurrentPhoto from "~/components/gallery/useCurrentPhoto";

const currentPhoto = useCurrentPhoto()






const {listingPhotos, listing} = useListing();


const swiperController = ref();
const thumbsSwiper = ref();
const currentPhotoIndex = ref();
//@ts-ignore
const getSwiperInstance = (swiper) => {
	swiperController.value = swiper;
}

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



//@ts-ignore
const setThumbsSwiper = (swiper) => {
	thumbsSwiper.value = swiper;
};

const closeModal = () => {
	
	currentPhoto.value.modal = false
}

//@ts-ignore
const onSlideChange = (swiper) => currentPhoto.value.index = swiper.activeIndex

watch(currentPhoto, () => {
	setTimeout(() => {
		swiperController.value.slideTo(currentPhoto.value.index, 0)
	}, 100)
}, {
	deep: true
})



</script>


<style lang="scss">



.img-preview {
	height: calc(100svh - 62px - 80px);
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