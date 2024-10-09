<script setup lang="ts">

import LKHeader from "~/components/pages/lk/LKHeader.vue";

import type {UserAuthResponse} from "~/types/response.types";


const authUser = useAuthUser()

const userData = reactive({
	name: authUser.value?.name,
	surname: authUser.value?.surname,
	patronymic: authUser.value?.patronymic
})

async function submitUpdate() {
	if (authUser.value) {
		const {data, error} = await useFetch('/api/user/update', {
			method: 'PUT',
			body: {
				id: authUser.value.id,
				...userData
			}
		})
	}
	
}



</script>

<template>
	<LKHeader/>
	<div class="wrapper mt-8">
		<v-card class="mt-4 mx-auto" max-width="500px" >
			<v-card-title>Редактировать профиль</v-card-title>
			<v-card-subtitle >Заполните профиль, чтобы оставлять отзывы и не вводить данные о гостях при бронирование.</v-card-subtitle>
			<v-card-item>
				<v-form class="mt-4" @click="submitUpdate">
					<v-text-field v-model="userData.name" label="Имя"/>
					<v-text-field v-model="userData.surname" label="Фамилия"/>
					<v-text-field v-model="userData.patronymic" label="Отчество (не обязательно)"/>
					<v-btn type="submit"  color="#7059FF" max-width="500px" width="100%" class="mb-4">Сохранить</v-btn>
				</v-form>
			</v-card-item>
			
		</v-card>
		
	</div>
	
</template>

<style scoped lang="scss">

</style>