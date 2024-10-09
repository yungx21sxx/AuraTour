<script lang="ts" setup>
const emit = defineEmits(['success'])

const { login } = useAuth()

const form = reactive({
	data: {
		login: '',
		password: '',
	},
	error: '',
	pending: false,
})

async function onLoginClick() {
	try {
		form.error = ''
		form.pending = true
		
		await login(form.data, 'ADMIN')
		
		emit('success')
	}
	catch (error: any) {
		console.error(error)
		
		if (error.data.message)
			form.error = error.data.message
	}
	finally {
		form.pending = false
	}
}
</script>

<template>
<p v-if="form.error" >
	{{ form.error }}
</p>
<form @submit.prevent="onLoginClick" class="form">
	<v-text-field v-model="form.data.login" type="text" label="Login" required variant="outlined"/>
	<v-text-field v-model="form.data.password" type="password" label="Password" required variant="outlined"/>
	<v-btn
		type="submit"
		:disabled="form.pending"
		width="100%"
		class="mt-4"
		color="primary"
	>
		Login
	</v-btn>
</form>
</template>


<style lang="scss" scoped>

form {
	padding: 24px;
	max-width: 500px;
	margin: 50px auto;
}

</style>