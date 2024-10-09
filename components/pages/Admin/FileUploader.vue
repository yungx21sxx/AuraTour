<script setup lang="ts">


	import type {PhotoUploadResponse} from "~/types/response.types";
	import draggable from 'vuedraggable';
	
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
		<v-card-title v-if="!preview">Загрузка фотографий</v-card-title>
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
			<v-btn
				v-if="!preview"
				:loading="filesLoading"
				:disabled="filesLoading"
				color="#c93"
				@click="uploadPhotos()"
				class="mb-4"
			>
				Загрузить
			</v-btn>
			<p class="hint">Загрузка фотографий обязательна. Для номеров просто желательна</p>
			
			<div v-if="photos && photos.length > 0" class="overflow mt-4">
				<h3>Загруженные фотки</h3>
				<draggable v-model="photos" item-key="id" tag="div" class="gallery mt-4" :animation="300">
					<template #item="{ element: photo }">
						<v-img
							class="pa-2"
							aspect-ratio="1"
							cover
							:src="photo.urlMin"
							:key="photo.id"
						>
							<v-btn icon="mdi-close" density="compact" color="#fff" @click="deletePhoto(photo.photoId)"></v-btn>
						</v-img>
					</template>
				</draggable>
			</div>
		</v-card-item>
	</v-card>
</template>

<style scoped lang="scss">

.hint {
	color: $text-gray;
}
.gallery {
	display: grid;
	@media screen and (max-width: 700px) {
		grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
	}
	width: 100%;
	max-width: 100% !important;
	grid-template-columns: repeat(auto-fit, minmax(120px, 200px));
	gap: 8px;
	
}

</style>