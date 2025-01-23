<script setup lang="ts">
import type { VideoUploadResponse } from "~/modules/Admin/ListingCRUD/types/response.types";
import BtnPrimary from "~/modules/Common/UI/BtnPrimary.vue";
import { VideoPlayer } from "@videojs-player/vue";
import 'video.js/dist/video-js.css';
import type { H3Error } from "h3";
import useListing from "~/modules/Listing/composables/useListing";

const { listing, initListingData } = useListing();

const videoTitle = ref<string | null>(null);
const videoFile = ref<File | null>(null);

const formRules = {
	title: [(v: string) => (!!v) || 'Введите заголовок.'],
	video: [(v: File) => (!!v) || 'Загрузите видео.']
};

const formRef = ref(null);
const videoUploading = ref(false);
const videoProcessing = ref(false);
const uploadProgress = ref(0);

async function onSubmit() {
	if (formRef.value) {
		const { valid } = await formRef.value.validate();
		if (!valid) {
			return;
		}
	} else {
		console.error('Form ref is not defined');
		return;
	}
	
	if (!videoFile.value) {
		alert('Выберите файл для загрузки.');
		return;
	}
	
	const formData = new FormData();
	formData.append('video', videoFile.value);
	formData.append('title', videoTitle.value as string);
	formData.append('listingId', listing.value.id);
	
	try {
		videoUploading.value = true;
		uploadProgress.value = 0;
		
		// Загрузка с отображением прогресса
		const response = await new Promise<VideoUploadResponse>((resolve, reject) => {
			const xhr = new XMLHttpRequest();
			xhr.open('POST', '/api/video/upload');
			xhr.upload.onprogress = (event) => {
				if (event.lengthComputable) {
					uploadProgress.value = Math.round((event.loaded / event.total) * 100);
				}
			};
			xhr.onload = () => {
				if (xhr.status === 200) {
					resolve(JSON.parse(xhr.response));
				} else {
					reject(new Error(`Ошибка загрузки: ${xhr.statusText}`));
				}
			};
			xhr.onerror = () => reject(new Error('Ошибка сети.'));
			xhr.send(formData);
		});
		
		// Начало обработки
		videoProcessing.value = true;
		await initListingData(listing.value.id);
		alert('Видео успешно загружено и обработано.');
	} catch (e: H3Error) {
		alert(e?.data?.message || 'Ошибка загрузки видео.');
	} finally {
		videoUploading.value = false;
		videoProcessing.value = false;
		uploadProgress.value = 0;
		videoTitle.value = null;
		videoFile.value = null;
	}
}

const deleteLoading = ref(false);

async function deleteVideo(videoId: number) {
	try {
		deleteLoading.value = true;
		await $fetch(`/api/video/${videoId}`, {
			method: 'DELETE'
		});
		await initListingData(listing.value.id);
	} catch (e: H3Error) {
		alert(e?.data?.message || 'Ошибка удаления видео.');
	} finally {
		deleteLoading.value = false;
	}
}
</script>

<template>
	<v-card class="mt-4">
		<v-card-title>Загрузка видео</v-card-title>
		<v-card-text>
			Видео загружать не обязательно. Введите заголовок для видео, затем загрузите сам файл. Видео добавляются по одному. Максимальный размер файла 500 МБ. Пока видео не обработалось, больше ничего не загружайте, это замедлит обработку в разы. Не спешите, когда оно обработаеться, просто само появиться на странице, можете просто ее переодически перезагружать.
		</v-card-text>
		<v-card-item>
			<v-form @submit.prevent="onSubmit" ref="formRef">
				<v-text-field
					:rules="formRules.title"
					required
					class="mt-2"
					label="Заголовок"
					variant="outlined"
					v-model="videoTitle"
				/>
				<v-file-input
					:rules="formRules.video"
					show-size
					required
					v-model="videoFile"
					label="Видео"
					variant="outlined"
					accept="video/*"
				/>
				<div v-if="uploadProgress > 0" class="progress mt-2">
					<v-progress-linear :value="uploadProgress" color="blue" />
					<p>{{ uploadProgress }}% Загружено</p>
				</div>
				<div v-if="uploadProgress === 100" class="mt-2 text-info">
					<p>Видео обрабатывается... Можете пока покинуть страницу</p>
				</div>
				<BtnPrimary :loading="videoUploading || videoProcessing" type="submit">Загрузить</BtnPrimary>
			</v-form>
		</v-card-item>
		<div v-if="listing.videos && listing.videos.length > 0">
			<v-card v-for="video of listing.videos" :key="video.id">
				<v-card-title>{{ video.title }}</v-card-title>
				<v-card-text>Длина: {{ video.formatedDuration }}</v-card-text>
				<v-lazy>
					<video-player
						aspect-ratio="16:9"
						:src="video.url"
						class="player"
						controls
						:loop="true"
						:volume="0.6"
					>
					</video-player>
				</v-lazy>
				<v-card-actions>
					<v-btn @click="deleteVideo(video.id)" :loading="deleteLoading" color="red">Удалить</v-btn>
				</v-card-actions>
			</v-card>
		</div>
	</v-card>
</template>

<style scoped lang="scss">
.player {
	width: 100%;
	height: 400px;
}
.progress {
	display: flex;
	flex-direction: column;
	align-items: center;
}
</style>