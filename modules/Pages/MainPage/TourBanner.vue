<script setup lang="ts">

import BtnSecondary from "~/modules/Common/UI/BtnSecondary.vue";
import TelegramIcon from "~/modules/Listing/icons/TelegramIcon.vue";
</script>

<template>
	<div class="pass">
		<div class="pass-content">
			<h2>Авторские туры по Абхазии</h2>
			<p>Полностью организуем ваш отдых: от встречи в аэропорту до проживания и экскурсий. Подпишитесь на наш Телеграм-канал, чтобы первыми узнавать о новых турах и предложениях.</p>
			<v-btn elevation="0" href="https://t.me/laura_tour" target="_blank">
				<template #prepend>
					<TelegramIcon/>
				</template>
				Подписаться
			</v-btn>
		</div>
	</div>
</template>

<style scoped lang="scss">

.pass {
	margin-top: 48px;
	background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.1)), url("/main-page/tour-bg-desktop.webp");
	border-radius: 16px;
	color: white;
	padding: 48px 32px;
	background-repeat: no-repeat;
	background-position: center;
	background-size: cover;
	
	h2 {
		margin-bottom: 8px;
		font-size: 32px;
	}
	p {
		margin-bottom: 24px;
	}
	.pass-content {
		max-width: 600px;
	}
	
	@media screen and (max-width: 560px) {
		
		height: auto;
		background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.1)), url("/main-page/tour-bg-mobile.webp");
		padding: 24px 16px;
		
		p {
			font-size: 14px;
		}
		
		h2 {
			font-size: 24px;
		}
	}
}

</style>