<script setup lang="ts">
	import useListing from "~/modules/Listing/composables/useListing";
	import BtnPrimary from "~/modules/Common/UI/BtnPrimary.vue";
	import { mdiImage } from '@mdi/js';
	import useGallery from "~/modules/Listing/composables/useGallery";
	
	const {listing} = useListing();
	const {currentPhoto, galleyThumbsModalIsOpen} = useGallery();
	
	function openGalleryModal(index: number) {
		currentPhoto.value.index = index
		currentPhoto.value.modal = true
	}
	
	
	
</script>

<template>
	<div class="gallery">
		<img class="gallery__photo gallery__photo-big" :src="listing.photos[0].urlFull" cover  @click="openGalleryModal(listing.photos[0].id)"/>
		<div class="gallery__thumbs">
			<img class="gallery__photo" :src="listing.photos[1].urlFull" cover  @click="openGalleryModal(listing.photos[1].id)"/>
			<img class="gallery__photo" :src="listing.photos[2].urlFull" cover @click="openGalleryModal(listing.photos[2].id)"/>
			<img class="gallery__photo" :src="listing.photos[3].urlFull" cover @click="openGalleryModal(listing.photos[3].id)"/>
			<img class="gallery__photo" :src="listing.photos[4].urlFull" cover @click="openGalleryModal(listing.photos[4].id)"/>
		</div>
		<BtnPrimary class="gallery__btn" :prepend-icon="mdiImage" @click="galleyThumbsModalIsOpen = true">Показать все фото</BtnPrimary>
	</div>
</template>
<style scoped lang="scss">
.gallery {
	display: grid;
	grid-template-columns: 1fr 1fr;
	grid-template-rows: 500px;
	gap: 10px;
	height: 500px;
	position: relative;
	overflow: hidden; // Ограничиваем контейнер галереи, чтобы изображения не выходили за его пределы
	
	&__btn {
		position: absolute;
		bottom: 24px;
		right: 24px;
	}
	
	&__photo {
		border-radius: 16px;
		width: 100%;
		height: 100%;
		object-fit: cover;
		overflow: hidden; // Ограничиваем изображение в рамках ячейки
	}
	
	&__photo-big {
		grid-column: 1 / 2;
		grid-row: 1 / 3;
		height: 100%;
		width: 100%;
	}
	
	&__thumbs {
		display: grid;
		grid-template-columns: 1fr 1fr;
		grid-template-rows: 1fr 1fr;
		gap: 10px;
		height: 100%; // Полностью заполняет оставшуюся высоту контейнера
		width: 100%;
		overflow: hidden; // Ограничиваем thumbnails контейнер, чтобы изображения не выходили за его пределы
	}
}
</style>