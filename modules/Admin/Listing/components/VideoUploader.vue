<script setup lang="ts">
	import type {VideoUploadResponse} from "~/modules/Admin/ListingCRUD/types/response.types";
	import BtnPrimary from "~/modules/Common/UI/BtnPrimary.vue";
	import {VideoPlayer} from "@videojs-player/vue";
	import 'video.js/dist/video-js.css';
	import type {H3Error} from "h3";
	import useListing from "~/modules/Listing/composables/useListing";
	const {listing, initListingData} = useListing();
	
	const videoTitle = ref<null | string>(null);
	const videoFile = ref<FormData | null>(null);
	
	const formRules = {
		title: [
			(v: string) => (!!v) || 'Введите заголовок.',
		],
		video: [
			(v: FormData) => (!!v) || 'Загрузите видео.',
		]
	}
	
	const formRef = ref(null)
	const videoLoading = ref(false)
	
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
		const formData = new FormData();
		
		formData.append('video', videoFile.value);
		formData.append('title', videoTitle.value);
		formData.append('listingId', listing.value.id);
		
		try {
			videoLoading.value = true;
			const videoUploadResponse = await $fetch<VideoUploadResponse>(`/api/video/upload`, {
				method: 'POST',
				body: formData
			});
			
			await initListingData(listing.value.id);
		} catch (e: H3Error) {
			alert(e.data.message);
		} finally {
			videoLoading.value = false;
			videoTitle.value = null;
			videoFile.value = null;
		}
	}
	
	const deleteLoading = ref(false)
	
	async function deleteVideo(videoId: number) {
		try {
			deleteLoading.value = true;
			await $fetch(`/api/video/${videoId}`,{
				method: 'DELETE'
			});
			await initListingData(listing.value.id);
		} catch (e: H3Error) {
			alert(e.data.message);
		} finally {
			deleteLoading.value = false;
		}
	}
	
</script>

<template>
	<v-card class="mt-4">
		<v-card-title>Загрузка видео</v-card-title>
		<v-card-text>Видео загружать не обязательно. Введите заголовок для видео, затем загрузите сам файл. Видео добавялються по одному.</v-card-text>
		<v-card-item>
			<v-form @submit.prevent="onSubmit" ref="formRef">
				<v-text-field :rules="formRules.title" required class="mt-2" label="Заголовок" variant="outlined" v-model="videoTitle"/>
				<v-file-input :rules="formRules.video" required label="Видео" v-model="videoFile" variant="outlined"/>
				<BtnPrimary :loading="videoLoading" type="submit">Загрузить</BtnPrimary>
			</v-form>
		</v-card-item>
		<div v-if="listing.videos && listing.videos.length > 0">
			<v-card v-for="video of listing.videos">
				<v-card-title>{{video.title}}</v-card-title>
				<v-card-text>Длина: {{video.formatedDuration}}</v-card-text>
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
</style>