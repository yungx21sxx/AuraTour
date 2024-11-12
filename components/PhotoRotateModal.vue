<script setup lang="ts">
import {mdiClose, mdiRotateLeft, mdiRotateRight} from "@mdi/js";
import type {H3Error} from "h3";
	
	interface rotateDTO {
		target: 'left' | 'right',
		photoId: number,
	}
	
	interface Photo {
		urlMin: string,
		photoId: number
	}
	
	const { photo } = defineProps<{
		photo: Photo | null
	}>();
	
	const isOpen = defineModel<boolean>();
	const {isMobile} = useDevice();
	const photoRefreshKey = ref(Date.now());
	
	const rotate = async (target: Pick<rotateDTO, 'target'>) => {
		try {
			if (!photo) return;
			await $fetch('/api/photo/rotate', {
				method: 'POST',
				body: {
					target,
					photoId: photo.photoId
				}
			});
			photoRefreshKey.value = Date.now();
		} catch (e: H3Error) {
			console.log(e.data.message);
		}
	}
	
</script>

<template>
	<v-dialog v-model="isOpen" max-width="500px" :fullscreen="isMobile">
		<v-card v-if="photo">
			<v-toolbar>
				<v-btn @click="isOpen = false" :icon="mdiClose"/>
				<v-toolbar-title>Перевернуть фото</v-toolbar-title>
			</v-toolbar>
			<v-card-item>
				<v-img :src="photo.urlMin" :key="photoRefreshKey">
					<v-btn :icon="mdiRotateLeft" @click="rotate('left')"/>
					<v-btn :icon="mdiRotateRight" @click="rotate('right')"/>
				</v-img>
			</v-card-item>
		</v-card>
	</v-dialog>
</template>

<style scoped lang="scss">

</style>