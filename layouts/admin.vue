<template>
	<v-app>
		<div class="wrapper wrapper_admin">
			<slot/>
		</div>
		<v-bottom-navigation
			v-model="currentPage"
		>
			<v-btn value="clients" href="/">
				<v-icon>mdi-home-export-outline</v-icon>
				<span>Назад</span>
			</v-btn>
			<v-btn value="clients" href="/admin/bookings" :active=" route.fullPath === '/admin/clients' ">
				<v-icon>mdi-account-edit</v-icon>
				<span>Бронирования</span>
			</v-btn>
			<v-btn value="portfolio" href="/admin/create-listing" :active=" route.fullPath === '/admin/portfolio' ">
				<v-icon>mdi-home-plus</v-icon>
				<span>Создать</span>
			</v-btn>
			<v-btn value="portfolio" href="/admin/search" :active=" route.fullPath === '/admin/portfolio' ">
				<v-icon>mdi-magnify</v-icon>
				<span>Поиск</span>
			</v-btn>
			
		</v-bottom-navigation>
	</v-app>
 

</template>

<script setup lang="ts">

	const { me } = useAuth()
	
	const route = useRoute();
	const linkParts = route.fullPath.split('/')
	const currentPage = ref<string>(
		linkParts[linkParts.length - 1]
	)
	async function logout() {
		await useFetch('/api/auth/logout');
		await me();
		navigateTo('/')
	}
</script>

<style scoped>
	.wrapper_admin {
		margin-bottom: 100px;
	}
</style>