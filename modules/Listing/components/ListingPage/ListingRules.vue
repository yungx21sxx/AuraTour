<script setup lang="ts">

</script>

<template>
	<div class="rules listing-block">
		<h2 class="rules__title">Важная информация</h2>
		<div class="rules__cols">
			<div class="rules__col">
				<h3 class="rules__subtitle">Правила проживания</h3>
				<div class="rules__rule">
					<NuxtIcon class="rules__icon" name="check-in" filled/>
					<div class="rules__text">Заезд: после 14:00</div>
				</div>
				<div class="rules__rule">
					<NuxtIcon class="rules__icon" name="check-out" filled/>
					<div class="rules__text">Выезд: до 12:00</div>
				</div>
				<div class="rules__rule">
					<NuxtIcon class="rules__icon" name="with-pets" filled/>
					<div class="rules__text">С питомцами: по согласованию</div>
				</div>
				<div class="rules__rule">
					<NuxtIcon class="rules__icon" name="with-children" filled/>
					<div class="rules__text">Размещение детей: любого возраста</div>
				</div>
			</div>
			<div class="rules__col">
				<h3 class="rules__subtitle">Правила бронирования</h3>
				<div class="rules__rule">
					<NuxtIcon class="rules__icon" name="prepay" filled/>
					<div class="rules__text">Предоплата: на усмотрение арендатора</div>
				</div>
				<div class="rules__rule">
					<NuxtIcon class="rules__icon" name="cancel-rules" filled/>
					<div class="rules__text">Условия бесплатной отмены брони: за 21 дней</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped lang="scss">
.rules {
	margin-top: 16px;
	&__cols {
		display: grid;
		margin-top: 16px;
		grid-template-columns: 1fr 1fr;
		@media screen and (max-width: 750px) {
			grid-template-columns: 1fr !important;
		}
		gap: 16px;
	}
	
	&__rule {
		display: flex;
		align-items: center;
		gap: 16px;
		margin-top: 16px;
	}
}

</style>