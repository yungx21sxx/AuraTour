<template>
	<AuthFormAdmin @success="onLoginSuccess" />
</template>

<script setup>
	const isAdmin = useAdmin()
	
	async function onLoginSuccess() {
		const redirect = isAdmin.value ? '/admin/bookings' : '/'
		await navigateTo(redirect)
	}
</script>

<style scoped>

</style>