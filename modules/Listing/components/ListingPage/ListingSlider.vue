<script setup lang="ts">


	
	import useListing from "~/modules/Listing/composables/useListing";
	
	const {listingPhotos} = useListing();
	const photoLinks = computed(() => listingPhotos.value.map(photo => photo.urlFull));
	
	const currentPhoto = ref(0)
	const fullScreen = ref(false)
	

</script>

<template>
	<div class="gallery ">
		<v-carousel
			class="gallery__slider"
			hide-delimiter-background
			v-model="currentPhoto"
		>
			<v-carousel-item
				v-for="photo of listingPhotos"
				:value="photo.id"
				@click="fullScreen = true"
			>
				<v-img :src="photo.urlFull" cover height="100%" />
			</v-carousel-item>
		</v-carousel>
		<div class="gallery__thumbs">
			<v-slide-group
				v-model="currentPhoto"
				show-arrows
			>
				<v-slide-group-item
					v-for="photo of listingPhotos"
					:value="photo.id"
					v-slot="{ isSelected, toggle, selectedClass }"
				>
					<v-card v-ripple
					        @click="currentPhoto = photo.id"
					        :class="['thumb', {
							'thumb_active': isSelected
						}]"
					>
						<v-img :src="photo.urlMin" aspect-ratio="1" cover height="60px" width="60px"></v-img>
					</v-card>
				</v-slide-group-item>
			</v-slide-group>
		</div>
	</div>
	
</template>

<style scoped lang="scss">
	.gallery {
		
		&__slider {
			border-radius: 10px;
			margin-bottom: 16px;
			@media screen and (max-width: 630px) {
				height: 320px !important;
			}
		}
		
		&__thumbs {
			max-width: 750px;
			margin-bottom: 16px;
		}
		
		
		
	}
	
	
	
	.thumb {
		overflow: hidden;
		margin: 6px;
		border: 2px solid rgba(0,0,0,0);
		transition: .3s ease;
		&_active {
			border: 2px solid $accent-orange;
		}
	}
</style>