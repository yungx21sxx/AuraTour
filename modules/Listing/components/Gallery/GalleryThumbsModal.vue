<script setup lang="ts">
	import useGallery from "~/modules/Listing/composables/useGallery";
	import useListing from "~/modules/Listing/composables/useListing";
	import {mdiChevronLeft, mdiHeartOutline, mdiShareVariant} from "@mdi/js"
	import GalleryToolbar from "~/modules/Listing/components/Gallery/GalleryToolbar.vue";
	const {currentPhoto, galleyThumbsModalIsOpen} = useGallery();
	const {listing} = useListing();
	
	function openGalleryModal(index: number) {
		currentPhoto.value.index = index
		currentPhoto.value.modal = true
	}
</script>

<template>
	<v-dialog
		fullscreen
		v-model="galleyThumbsModalIsOpen"
	>
		<v-card color="black">
			<GalleryToolbar @on-close="galleyThumbsModalIsOpen = false" color="black"/>
		
				<div class="wrapper gallery-thumbs">
					<v-img
						v-for="photo of listing.photos"
						:key="photo.id"
						:src="photo.urlMin"
						class="gallery__img"
						cover
						@click="openGalleryModal(photo.id)"
					></v-img>
				</div>
		
			
		</v-card>
	</v-dialog>
	
</template>

<style scoped lang="scss">
	.gallery-thumbs {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
		gap: 16px;
		
		@media screen and (max-width: 650px) {
			grid-template-columns: repeat(2, 1fr);
		}
		
	}
	

</style>