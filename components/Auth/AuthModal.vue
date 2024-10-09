<script setup lang="ts">
	const {authModalIsOpen} = useAuth()
	const {isMobile} = useDevice()
</script>

<template>
	<v-dialog v-model="authModalIsOpen" :fullscreen="isMobile" max-width="500px">
		<v-card>
			<v-toolbar>
				<v-btn
					icon="mdi-close"
					@click="authModalIsOpen = false"
				></v-btn>
				
				<v-toolbar-title>Авторизация</v-toolbar-title>
				
				<v-spacer></v-spacer>
				
				
			</v-toolbar>
			<v-card-item>
				<AuthFormUser class="mb-8"/>
			</v-card-item>
			
		</v-card>
	</v-dialog>
</template>

<style scoped lang="scss">

</style>