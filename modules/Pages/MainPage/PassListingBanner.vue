<script setup lang="ts">

import BtnSecondary from "~/modules/Common/UI/BtnSecondary.vue";
import useLandLordModal from "~/modules/Common/useLandLordModal";

const landLordModal = useLandLordModal()

</script>

<template>
	<div class="pass">
		<div class="pass-content">
			<h2>Сдать жилье на АураТур</h2>
			<p>Мы возьмем на себя полное обслуживание, поиск гостей и гарантируем высокую заполняемость.</p>
			<BtnSecondary @click="landLordModal = true">Подробнее</BtnSecondary>
		</div>
	</div>
</template>

<style scoped lang="scss">

.pass {
	background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.1)), url("/main-page/pass-background.webp");
	height: 250px;
	border-radius: 16px;
	color: white;
	padding: 32px;
	background-repeat: no-repeat;
	background-position: center;
	background-size: cover;
	
	h2 {
		margin-bottom: 8px;
	}
	p {
		margin-bottom: 24px;
	}
	.pass-content {
		max-width: 600px;
	}
	
	@media screen and (max-width: 560px) {
		height: auto;
		background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.1)), url("/main-page/pass-background-mob.webp");
		padding: 24px 16px;
	}
}

</style>