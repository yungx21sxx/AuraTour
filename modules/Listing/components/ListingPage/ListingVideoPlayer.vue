<script setup lang="ts">

	import { VideoPlayer } from '@videojs-player/vue';
	import 'video.js/dist/video-js.css';
	


</script>

<template>
	<div class="listing-block">
		<h2 class="info__title mb-4">Видео объекта</h2>
		<video-player
			src="/video.mp4"
			poster="/connection.svg"
			class="player"
			controls
			responsive
			:loop="true"
			:volume="0.6"
		>
		</video-player>
	</div>
</template>

<style scoped lang="scss">

	.player {
		width: 100%;
		height: 400px;
		
		@media screen and (max-width: 630px) {
			height: 300px;
		}
	}
	
	
</style>