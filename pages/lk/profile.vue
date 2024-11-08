<script setup lang="ts">
import {useAuthUser} from "~/modules/Auth/composables/useAuthUser";
import {beautifyDate} from "~/modules/Common/Utils/dates.utils";
import {formatDate} from "~/modules/Listing/utils/dates";
import type {PhotoUploadResponse} from "~/modules/Admin/ListingCRUD/types/response.types";
import {useAuth} from "~/modules/Auth/composables/useAuth";
import BtnPrimary from "~/modules/Common/UI/BtnPrimary.vue";
import {mdiCashCheck} from "@mdi/js";

definePageMeta({
	layout: 'lk',
	middleware: ['auth-user-only']
})

const authUser = useAuthUser();
const {setAuthUser, fetchProfile} = useAuth()
const editDetected = ref(false)

const {data: user, refresh} = await useAsyncData('user-full-info', () => $fetch(`/api/users/${authUser.value?.id}/main-info`));

const userEditFromData = ref({
	name: user.value.name,
	surname: user.value.surname,
	phone: user.value.phone,
	email: user.value.email,
});

const adminEditData = ref({
	telegram: null,
	avatarId: null,
})

const fileLoading = ref(false);
const avatar = ref(null);
const serverError = ref();

async function updateUserInfo() {
	try {
		const {email, ...mainData} = userEditFromData.value;
		const dto: Record<string, any> = {
			...mainData,
		}
		if (adminEditData.value.avatarId) {
			dto.avatarId = adminEditData.value.avatarId
		}
		
		if (adminEditData.value.telegram) {
			dto.telegram = adminEditData.value.telegram
		}
		const {data: updatedUser} = await $fetch(`/api/users/${authUser.value?.id}`, {
			method: 'PUT',
			body: dto
		})
		await fetchProfile();
		await refresh();
	} catch (e) {
		console.log(e)
	}
}

async function uploadAvatar() {
	const formData = new FormData()
	if (!avatar.value) {
		alert('Необходимо загрузить фотографию');
		return;
	}
	formData.append('photo1', avatar.value);
	try {
		fileLoading.value = true;
		const photosResponse = await $fetch<PhotoUploadResponse[]>(`/api/photo/upload-photos`, {
			method: "POST",
			body: formData,
		})
		authUser.value.avatar = photosResponse[0].urlMin;
		adminEditData.value.avatarId = photosResponse[0].photoId;
		await updateUserInfo();
		alert('Фотография загружена');
	} catch (e) {
		console.log(e)
	} finally {
		fileLoading.value = false;
	}
}

watch([userEditFromData, adminEditData], () => {
	editDetected.value = true
}, {deep: true})

const isAdmin = computed(() => ['ADMIN', 'MANAGER'].includes(authUser.value?.role))

</script>

<template>
	<h2 class="title">Мой профиль</h2>
	<p class="mb-6">Дата регистрации: <strong>{{formatDate(user.createdAt) }}</strong></p>
	<v-text-field  v-model="userEditFromData.name" label="Имя"></v-text-field>
	<v-text-field  v-model="userEditFromData.surname" label="Имя"></v-text-field>
	<v-text-field type="email" v-model="userEditFromData.email" label="Почта"></v-text-field>
	<PhoneInput  v-model="userEditFromData.phone" label="Телефон"></PhoneInput>
	
	<div v-if="isAdmin">
		<v-file-input label="Загрузить аватар" v-model="avatar" :show-size="1000"/>
		<BtnPrimary class="mb-4" @click="uploadAvatar" :loading="fileLoading">Загрузить</BtnPrimary>
		<v-text-field v-model="adminEditData.telegram" label="Ник в телеграмм"></v-text-field>
	</div>
	<BtnPrimary :disabled="!editDetected" @click="updateUserInfo">Сохранить изменения</BtnPrimary>
	<h2 class="title mt-6">Бонусы</h2>
	<p class="mb-6">Бонусов накопленно: <strong>{{authUser.bonusPoints}}</strong></p>
	
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