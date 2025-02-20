<script setup lang="ts">

	import 'video.js/dist/video-js.css';
	import useListing from "~/modules/Listing/composables/useListing";
	
	const {listing} = useListing();
	
	const { VideoPlayer } = defineAsyncComponent(() => import('@videojs-player/vue'));
	const loaded = ref(false);
	
	onMounted(() => {
		loaded.value = true;
	});


</script>

<template>
	<div class="listing-block">
		<h2 class="info__title mb-4">Видео объекта</h2>
		<v-expansion-panels>
			<v-expansion-panel
				v-for="video of listing.videos"
				:key="video"
			>
				<v-expansion-panel-title>
					<div>
						<h4 class="mb-2">{{video.title}}</h4>
						<p>{{video.formatedDuration}}</p>
					</div>
				</v-expansion-panel-title>
				<v-expansion-panel-text>
					<video-player
						aspect-ratio="16:9"
						:src="video.url"
						v-if="loaded"
						preload="auto"
						class="player"
						controls
						:loop="true"
						:volume="0.6"
					>
					</video-player>
				</v-expansion-panel-text>
			</v-expansion-panel>
		</v-expansion-panels>
		
	</div>
</template>

<style scoped lang="scss">

	.player {
		width: 100%;
		height: 400px;
	}
	
	
</style>