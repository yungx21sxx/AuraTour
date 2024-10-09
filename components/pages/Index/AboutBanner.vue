<script setup lang="ts">

</script>

<template>
	<div class="about wrapper">
		<div class="about__content">
			<div class="about__subtitle">Жилье по доступным ценам</div>
			<h2 class="about__title">
				Путешествуйте по Абхазии <br> вместе с нами
			</h2>
			<p>Ваш персональный проводник в мире путешествий и уютного жилья в Абхазии! Мы предлагаем широкий выбор вариантов размещения - от уютных апартаментов до роскошных вилл. С нами вы можете быть уверены, что ваш отдых станет незабываемым.</p>
			<v-btn color="#7059FF" href="/search">Смотреть жилье</v-btn>
		</div>

		<v-img src="/main-page/about.webp" class="about__img" cover>
		</v-img>
		
		
	</div>
	
</template>

<style scoped lang="scss">

.about {
	display: flex;
	justify-content: space-between;
	margin-top: 24px;
	
	&__img {
		box-shadow: $elevation;
		border-radius: 8px;
		max-width: 490px;
	}
	&__subtitle {
		color: $accent-orange;
		font-weight: 600;
		margin-bottom: 8px;
	}
	
	&__content {
		max-width: 500px;
	}
	&__title {
		font-size: 24px;
		margin-bottom: 16px;
	}
	p {
		margin-bottom: 16px;
	}
	
	@media screen and (max-width: 840px) {
		display: block;
		&__img {
			margin-top: 24px;
		}
	}
}

</style>