<script setup lang="ts">


</script>

<template>
	<div class="wrapper cards">
		<v-card class="card">
			<NuxtIcon name="transfer" filled class="card__icon"/>
			<p class="card__text">Предоставляем трансферы <br> из Сочи</p>
			<VBtn variant="text" append-icon="mdi-chevron-right" color="#7059FF">Подробнее</VBtn>
		</v-card>
		<v-card class="card">
			<NuxtIcon name="photo" filled class="card__icon"/>
			<p class="card__text">Проводим индивидуальные <br>
				и групповые экскурсии</p>
			<VBtn variant="text" append-icon="mdi-chevron-right" color="#7059FF">Подробнее</VBtn>
		</v-card>
		<v-card class="card">
			<NuxtIcon name="promo" filled class="card__icon"/>
			<p class="card__text">Бонусная программа, <br>
				бесплатные экскурсии</p>
			<VBtn variant="text" append-icon="mdi-chevron-right" color="#7059FF">Подробнее</VBtn>
		</v-card>
	</div>
</template>

<style scoped lang="scss">

	.cards {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 32px;
		margin-top: 32px;
	}
	
	.card {
		text-align: center;
	
		padding: 16px 0 8px 0;
		
		
		&__text {
			font-size: 20px;
			margin-top: 8px;
			margin-bottom: 4px;
		}
	}
	
	

</style>