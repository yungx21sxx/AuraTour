<script setup lang="ts">
import {useAuthUser} from "~/modules/Auth/composables/useAuthUser";
import {beautifyDate} from "~/modules/Common/Utils/dates.utils";
import {formatDate} from "~/modules/Listing/utils/dates";
import type {PhotoUploadResponse} from "~/modules/Admin/ListingCRUD/types/response.types";
import {useAuth} from "~/modules/Auth/composables/useAuth";
import BtnPrimary from "~/modules/Common/UI/BtnPrimary.vue";
import {mdiCashCheck, mdiClose, mdiRotateLeft, mdiRotateRight} from "@mdi/js";
import type {H3Error} from "h3";

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

const snackbar = ref(false)

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
		snackbar.value = true
	} catch (e) {
		console.log(e)
	}
}


const uploadedPhoto = ref<PhotoUploadResponse | null>();

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
		uploadedPhoto.value = photosResponse[0]
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

interface rotateDTO {
	target: 'left' | 'right',
	photoId: number,
}

const rotate = async (dto: rotateDTO) => {
	try {
		await $fetch('/api/photo/rotate', {
			method: 'POST',
			body: {
				target: dto.target,
				photoId: dto.photoId
			}
		});
		
		uploadedPhoto.value.urlMin = `${uploadedPhoto.value.urlMin}?t=${new Date().getTime()}`;
		
	} catch (e: H3Error) {
		console.log(e.data.message);
	}
}

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
		<v-img
			class="pa-2"
			aspect-ratio="1"
			cover
			height="200px"
			width="200px"
			:src="uploadedPhoto.urlMin"
			v-if="uploadedPhoto"
		>
			<div class="image-control">
				<div class="rotate-btns">
					<v-btn class="delete-btn" :icon="mdiRotateLeft" density="compact" color="#fff" @click="rotate({target: 'left', photoId: uploadedPhoto.photoId})"></v-btn>
					<v-btn class="delete-btn" :icon="mdiRotateRight" density="compact" color="#fff" @click="rotate({target: 'right', photoId: uploadedPhoto.photoId})"></v-btn>
				</div>
			</div>
		</v-img>
		<div>Имя пользователя без знака @</div>
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
	<v-snackbar
		v-model="snackbar"
		:timeout="2000"
	>
		Изменения сохранены
		<template v-slot:actions>
			<v-btn
				color="pink"
				variant="text"
				@click="snackbar = false"
			>
				Закрыть
			</v-btn>
		</template>
	</v-snackbar>
	
</template>

<style scoped lang="scss">

.image-control {
	display: flex;
	flex-direction: column;
	height: 100%;
	width: 100%;
	justify-content: space-between;
	.rotate-btns {
		display: flex;
		justify-content: space-between;
	}
}

</style>