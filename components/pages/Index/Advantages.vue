<script setup lang="ts">

</script>

<template>
	<div class="advantages wrapper">
		<div class="advantage">
			<NuxtIcon class="advantage__icon" name="main-page/check" filled/>
			<h4 class="advantage__title">Только проверенное жилье</h4>
			<p class="advantage__text">Мы тщательно отбираем и проверяем все наши объявления. У нас вы найдете жилье на любой вкус и кошелек.</p>
		</div>
		<div class="advantage">
			<NuxtIcon class="advantage__icon" name="main-page/search" filled/>
			<h4 class="advantage__title">Поиск по датам и ценам</h4>
			<p class="advantage__text">С легкостью находите подходящее жильё. Какой бы вариант проживания вы ни искали, вы найдете его у нас.</p>
		</div>
		<div class="advantage">
			<NuxtIcon class="advantage__icon" name="main-page/transfer" filled/>
			<h4 class="advantage__title">Трансферы из Сочи</h4>
			<p class="advantage__text">Обеспечим ваш комфортный трансфер от любой точки встречи до места проживания.</p>
		</div>
	</div>
</template>

<style scoped lang="scss">

	.advantages {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		margin-top: 48px;
		text-align: center;
		gap: 24px;
		@media screen and (max-width: 710px) {
			grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
		}
	}
	
	
	
	.advantage {
		box-shadow: $elevation;
		& * {
			margin-bottom: 16px;
		}
		
		background: #FFFFFF;
		border-radius: 10px;
		padding: 24px 16px;
		&__icon {
			display: block;
		}
		
		&__title {
			font-size: 18px;
		}
	}

</style>