<script setup lang="ts">


</script>

<template>
	<v-sheet
		class="mx-auto p"
		max-width="800"
		
	>
		<v-slide-group>
			<v-slide-group-item  v-slot="{ isSelected, toggle, selectedClass }">
				<v-card class="card">
					<NuxtIcon name="transfer" filled class="card__icon"/>
					<p class="card__text">Трансферы <br> из Сочи</p>
					<VBtn variant="text" append-icon="mdi-chevron-right" color="#7059FF" class="card__btn">Подробнее</VBtn>
				</v-card>
			</v-slide-group-item >
			<v-slide-group-item  v-slot="{ isSelected, toggle, selectedClass }">
				<v-card class="card">
					<NuxtIcon name="photo" filled class="card__icon"/>
					<p class="card__text">Экскурсии</p>
					<VBtn variant="text" append-icon="mdi-chevron-right" color="#7059FF" class="card__btn">Подробнее</VBtn>
				</v-card>
			</v-slide-group-item>
			<v-slide-group-item  v-slot="{ isSelected, toggle, selectedClass }">
				<v-card class="card">
					<NuxtIcon name="promo" filled class="card__icon"/>
					<p class="card__text">Бонусная <br> программа</p>
					<VBtn variant="text" append-icon="mdi-chevron-right" color="#7059FF" class="card__btn">Подробнее</VBtn>
				</v-card>
			</v-slide-group-item>
			
		</v-slide-group>
	</v-sheet>
</template>

<style scoped lang="scss">



.card {
	text-align: center;
	
	padding: 8px;
	margin: 8px;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	
	
	&__text {
		font-size: 20px;
		margin-top: 8px;
		margin-bottom: 4px;
	}
	
	
}

.p {
	padding: 16px;
}



</style>