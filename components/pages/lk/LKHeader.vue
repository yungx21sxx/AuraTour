<script setup lang="ts">
	const route = useRoute();
	const tabs = {
		'/lk/edit': 1,
		'/lk/bookings': 2,
		'/lk/reviews': 3
	}
	const chosenTab = ref(1)
	
	//@ts-ignore
	const tab = ref(tabs[route.fullPath])

</script>

<template>

		<v-card elevation="0">
			<v-toolbar color="rgba(0,0,0,0)">
				<v-btn
					icon="mdi-arrow-left-thin-circle-outline"
					href="/"
				></v-btn>
				
				<v-toolbar-title>Личный кабинет</v-toolbar-title>
				
				<v-spacer></v-spacer>
			
			</v-toolbar>
			<v-tabs align-tabs="center" v-model="tab" color="#7059FF">
				<v-tab href="/lk/edit" :value="1">Профиль</v-tab>
				<v-tab href="/lk/bookings" :value="2" >Бронироваия</v-tab>
				<v-tab href="/lk/reviews" :value="3">Отзывы</v-tab>
			</v-tabs>
		</v-card>
		
		
	
	
</template>

<style scoped lang="scss">

</style>