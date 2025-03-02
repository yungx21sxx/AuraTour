<script setup lang="ts">

import TransferIcon from "~/modules/Pages/About/icons/TransferIcon.vue";
import AccessIcon from "~/modules/Pages/About/icons/AccessIcon.vue";
import ConsultIcon from "~/modules/Pages/About/icons/ConsultIcon.vue";
</script>

<template>
	<div class="wrapper" itemscope itemtype="https://schema.org/ItemList">
		<meta itemprop="name" content="Наши услуги"/>
		<h2 class="title">Наши услуги</h2>
		<div class="services" itemprop="itemListElement">
			<div class="service" itemscope itemtype="https://schema.org/Service">
				<AccessIcon/>
				<h4 class="service__title" itemprop="name">Персональный подбор жилья</h4>
				<p class="service__text" itemprop="description">Поможем вам найти идеальное место для отдыха.</p>
			</div>
			<div class="service" itemscope itemtype="https://schema.org/Service">
				<TransferIcon/>
				<h4 class="service__title" itemprop="name">Трансферы и экскурсии</h4>
				<p class="service__text" itemprop="description">Организуем трансферы и экскурсии через наших надежных партнеров.</p>
			</div>
			<div class="service" itemscope itemtype="https://schema.org/Service">
				<ConsultIcon/>
				<h4 class="service__title" itemprop="name">Бесплатные консультации</h4>
				<p class="service__text" itemprop="description">Бесплатные советы по всем вопросам: куда сходить, что посмотреть.</p>
			</div>
		</div>
	</div>
</template>

<style scoped lang="scss">
	.title {
		font-size: 32px;
		margin-top: 70px;
		text-align: center;
	}
	
	.services {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		margin-top: 24px;
		text-align: center;
		gap: 24px;
	}
	@media screen and (max-width: 710px) {
		.services {
			grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
		}
		.title {
			margin-top: 60px;
			font-size: 24px;
		}
	
	}
	
	
	.service {
		box-shadow: $elevation;
		
		
		background: #FFFFFF;
		border-radius: 10px;
		padding: 24px 16px;
		&__icon {
			display: block;
		}
		&__text {
			color: $text-gray;
		}
		
		&__title {
			font-size: 18px;
			margin-bottom: 8px;
			margin-top: 16px;
			color: $text-main;
		}
	}

</style>