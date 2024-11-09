<script setup lang="ts">
import {useAuthUser} from "~/modules/Auth/composables/useAuthUser";
import {beautifyDate} from "~/modules/Common/Utils/dates.utils";
import {formatDate} from "~/modules/Listing/utils/dates";

import BtnPrimary from "~/modules/Common/UI/BtnPrimary.vue";
import {mdiCashCheck} from "@mdi/js";
import {bo} from "~/.output/server/chunks/build/server.mjs";

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
		alert('Информация обновленна')
	} catch (e) {
		console.log(e)
	}
}

const currentOperation = ref('add')
const bonusOperations = [
	{
		value: 'add',
		title: 'Начислить'
	},
	{
		value: 'deduct',
		title: 'Списать'
	}
]
const bonusAmount = ref<null | number>(null);

const createBonusTransaction = async () => {
	if (!bonusAmount.value || bonusAmount.value === 0) {
		alert('укажите количество бонусов');
		return;
	}
	try {
		await $fetch(`/api/users/${user.value.id}/bonus/${currentOperation.value}`, {
			method: 'POST',
			body: {
				amount: bonusAmount.value
			}
		});
		await refresh();
		alert('Операция выполнена');
	} catch (e) {
		alert(e.data.message);
	}
}


watch(userEditFromData, () => {
	editDetected.value = true
}, {deep: true})

</script>

<template>
	<div style="padding: 16px">
		<p class="mb-6">Дата регистрации: <strong>{{formatDate(user.createdAt) }}</strong></p>
		
		<v-select v-model="userEditFromData.role" :items="userRoles" item-title="name" item-value="value" label="Роль пользователя"/>
		<v-text-field  v-model="userEditFromData.name" label="Имя"></v-text-field>
		<v-text-field  v-model="userEditFromData.surname" label="Имя"></v-text-field>
		<v-text-field type="email" v-model="userEditFromData.email" label="Почта"></v-text-field>
		<PhoneInput  v-model="userEditFromData.phone" label="Телефон"></PhoneInput>
		
		<BtnPrimary :disabled="!editDetected" @click="updateUserInfo">Сохранить изменения</BtnPrimary>
		
		
		<h2 class="title mt-6">Бонусы</h2>
		<p class="mb-6">Бонусов накопленно: <strong>{{user.bonusPoints}}</strong></p>
		
		<v-select
			v-model="currentOperation"
			:items="bonusOperations"
			item-value="value"
			item-title="title"
			label="Тип операции"
		></v-select>
		<v-number-input v-model="bonusAmount"/>
		<BtnPrimary @click="createBonusTransaction">Сохдать транзакцию</BtnPrimary>
		
		<h2 class="title mt-6">Транзакции</h2>
		<v-list lines="two">
			<v-list-item
				v-for="transaction of user.BonusTransaction"
				:title="transaction.description"
				:prepend-icon="mdiCashCheck"
				:subtitle="`На сумму: ${Math.abs(transaction.amount).toLocaleString()}`"
			/>
		</v-list>
	</div>
	


</template>

<style scoped lang="scss">

</style>