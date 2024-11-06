<script setup lang="ts">


import type {PhotoUploadResponse} from "~/modules/Admin/ListingCRUD/types/response.types";
import { VueDraggableNext } from 'vue-draggable-next'
import BtnPrimary from "~/modules/Common/UI/BtnPrimary.vue";
import {mdiClose, mdiRotateLeft, mdiRotateRight} from "@mdi/js";

defineProps<{
	preview?: boolean
}>();

const photos = defineModel<PhotoUploadResponse[]>()

const filesLoading = ref(false);
const files = ref([]);

async function uploadPhotos() {
	const formData = new FormData()
	if (files.value.length === 0) {
		alert('Необходимо загрузить фотографии');
		return;
	}
	for (let i = 0; i < files.value.length; i++) {
		const file = files.value[i]
		formData.append(`photo${i}`, file)
	}
	try {
		filesLoading.value = true;
		
		const photosResponse = await $fetch<PhotoUploadResponse[]>(`/api/photo/upload-photos`, {
			method: "POST",
			body: formData,
		})
		
		filesLoading.value = false;
		files.value = [];
		
		if (photos.value) {
			photos.value.push(...photosResponse);
		}
		
	} catch (e) {
		console.log(e)
	}
}



const deletePhoto = async (id: number) => {
	try {
		await useFetch(`/api/photo/${id}`, {
			method: "DELETE",
		})
		if (photos.value)
			photos.value = photos.value.filter(photo => photo.photoId !== id);
	} catch (e) {
		console.log(e)
	}
}

</script>

<template>
	<v-card class="mt-4" >
		<v-card-title v-if="!preview">Загрузка фотографии</v-card-title>
		<v-card-text>Загрузка фотографий обязательна</v-card-text>
		<v-card-item>
			<v-file-input
				v-if="!preview"
				v-model="files"
				color="deep-purple-accent-4"
				counter
				label="Фотографии объекта"
				multiple
				placeholder="Select your files"
				variant="outlined"
				:show-size="1000"
			>
				<template v-slot:selection="{ fileNames }">
					<template v-for="(fileName, index) in fileNames" :key="fileName">
						<v-chip
							v-if="index < 2"
							color="deep-purple-accent-4"
							label
							size="small"
							class="me-2"
						>
							{{ fileName }}
						</v-chip>
					</template>
				</template>
			</v-file-input>
			<BtnPrimary
				v-if="!preview"
				:loading="filesLoading"
				:disabled="filesLoading"
				@click="uploadPhotos()"
				class="mb-4"
			>
				Загрузить
			</BtnPrimary>
			<div v-if="photos && photos.length > 0" class="overflow mt-4">
				<v-card-title>Загруженные фотки</v-card-title>
				<p>Фотографии можно менять местами и переворачивать.</p>
				<VueDraggableNext v-model="photos" class="gallery-img mt-4">
					<transition-group>
						<v-img
							class="pa-2"
							aspect-ratio="1"
							cover
							v-for="photo of photos"
							:src="photo.urlMin"
							:key="photo.id"
						>
							<div class="image-control">
								<v-btn class="delete-btn" color="red" :icon="mdiClose" density="compact"  @click="deletePhoto(photo.photoId)"></v-btn>
								<div class="rotate-btns">
									<v-btn class="delete-btn" :icon="mdiRotateLeft" density="compact" color="#fff" @click=""></v-btn>
									<v-btn class="delete-btn" :icon="mdiRotateRight" density="compact" color="#fff" @click=""></v-btn>
								</div>
							</div>
						</v-img>
					</transition-group>
				</VueDraggableNext>
			</div>
		</v-card-item>
	</v-card>
</template>

<style scoped lang="scss">

.hint {
	color: $text-gray;
}

.image-control {
	display: flex;
	flex-direction: column;
	height: 100%;
	width: 100%;
	justify-content: space-between;
	.rotate-btns {
		display: flex;
		justify-content: space-between;
	}
}

.gallery-img {
	display: grid;
	
	width: 100%;
	max-width: 100% !important;
	grid-template-columns: repeat(auto-fit, minmax(120px, 200px));
	gap: 8px;
	
	@media screen and (max-width: 700px) {
		grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
	}
	
}

</style>