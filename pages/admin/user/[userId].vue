<script setup lang="ts">
import {useAuthUser} from "~/modules/Auth/composables/useAuthUser";
import {beautifyDate} from "~/modules/Common/Utils/dates.utils";
import {formatDate} from "~/modules/Listing/utils/dates";

import BtnPrimary from "~/modules/Common/UI/BtnPrimary.vue";
import {mdiCashCheck} from "@mdi/js";

definePageMeta({
	layout: 'admin',
	middleware: ['admin-only']
})


const editDetected = ref(false);

const route = useRoute()
const {data: user, error, refresh} = await useAsyncData('user-full-info', () => $fetch(`/api/users/${route.params.userId}/main-info`));

const userEditFromData = ref({
	role: user.value.role,
	name: user.value.name,
	surname: user.value.surname,
	phone: user.value.phone,
	email: user.value.email,
});

const userRoles = [
	{
		value: 'TOURIST',
		name: 'Турист'
	},
	{
		value: 'LANDLORD',
		name: 'Отельер'
	},
	{
		value: 'MANAGER',
		name: 'Менеджер'
	},
	{
		value: 'ADMIN',
		name: 'Админ'
	},
]

const fileLoading = ref(false);
const avatar = ref(null);
const serverError = ref();

async function updateUserInfo() {
	try {
		const {email, ...mainData} = userEditFromData.value;
		const dto: Record<string, any> = {
			...mainData,
		}
		const {data: updatedUser} = await $fetch(`/api/users/${route.params.userId}`, {
			method: 'PUT',
			body: dto
		})
		await refresh();
	} catch (e) {
		console.log(e)
	}
}


watch(userEditFromData, () => {
	editDetected.value = true
}, {deep: true})

</script>

<template>
	<p class="mb-6">Дата регистрации: <strong>{{formatDate(user.createdAt) }}</strong></p>
	
	<v-select v-model="userEditFromData.role" :items="userRoles" item-title="name" item-value="value" label="Роль пользователя"/>
	<v-text-field  v-model="userEditFromData.name" label="Имя"></v-text-field>
	<v-text-field  v-model="userEditFromData.surname" label="Имя"></v-text-field>
	<v-text-field type="email" v-model="userEditFromData.email" label="Почта"></v-text-field>
	<PhoneInput  v-model="userEditFromData.phone" label="Телефон"></PhoneInput>
	
	<BtnPrimary :disabled="!editDetected" @click="updateUserInfo">Сохранить изменения</BtnPrimary>
	<h2 class="title mt-6">Бонусы</h2>
	<p class="mb-6">Бонусов накопленно: <strong>{{user.bonusPoints}}</strong></p>
	
	<v-list lines="two">
		<v-list-item
			v-for="transaction of user.BonusTransaction"
			:title="transaction.description"
			:prepend-icon="mdiCashCheck"
			:subtitle="`На сумму: ${Math.abs(transaction.amount).toLocaleString()}`"
		/>
	</v-list>


</template>

<style scoped lang="scss">

</style>