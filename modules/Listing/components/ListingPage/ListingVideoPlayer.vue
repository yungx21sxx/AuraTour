<script setup lang="ts">

	import { VideoPlayer } from '@videojs-player/vue';
	import 'video.js/dist/video-js.css';
	import useListing from "~/modules/Listing/composables/useListing";
	
	const {listing} = useListing();


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