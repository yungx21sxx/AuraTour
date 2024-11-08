<template>
	<v-form ref="formRef" @submit.prevent="submit" style="margin: 24px 0">
		<v-text-field
			v-model="emailInput"
			label="Почта"
			:rules="emailRules"
			required
		></v-text-field>
		
		<v-text-field
			v-model="firstName"
			label="Имя"
			:rules="nameRules"
			required
		></v-text-field>
		
		<v-text-field
			v-model="lastName"
			label="Фамилия"
			:rules="nameRules"
			required
		></v-text-field>
		
		<PhoneInput
			v-model="phone"
			label="Номер телефона"
			type="tel"
		></PhoneInput>
		
		<BtnPrimary
			type="submit"
			:loading="isLoading"
			block
		>
			Зарегистрироваться
		</BtnPrimary>
		
		<div v-if="serverErrors.length" style="color: red; margin-top: 16px;">
			<ul>
				<li v-for="(error, index) in serverErrors" :key="index">
					{{ error }}
				</li>
			</ul>
		</div>
	</v-form>
</template>

<script lang="ts" setup>
import { ref, defineEmits } from 'vue';

import BtnPrimary from "~/modules/Common/UI/BtnPrimary.vue";
import {AuthAPI} from "~/modules/Auth/api/auth.api";
import type {H3Error} from "h3";

const emit = defineEmits(['onSuccess']);

const formRef = ref();

const emailInput = ref('');
const firstName = ref('');
const lastName = ref('');
const phone = ref('');

const isLoading = ref(false);
const serverErrors = ref<string[]>([]);

const emailRules = [
	(v: string) => !!v || 'Почта обязательна для заполнения',
	(v: string) => /.+@.+\..+/.test(v) || 'Некорректный формат почты',
];

const nameRules = [
	(v: string) => !!v || 'Поле обязательно для заполнения',
];

const submit = async () => {
	if (formRef.value) {
		const { valid } = await formRef.value.validate();
		if (!valid) {
			return;
		}
	} else {
		console.error('Form ref is not defined');
		return;
	}
	
	isLoading.value = true;
	serverErrors.value = [];
	try {
		const {email} = await AuthAPI.registration({
			email: emailInput.value,
			name: firstName.value,
			surname: lastName.value,
			phone: phone.value || undefined,
		})
		emit('onSuccess', email);
	} catch (error: H3Error) {
		if (error && error.data) {
			serverErrors.value = [error.data.message];
		} else {
			serverErrors.value = ['Произошла ошибка при регистрации'];
		}
	} finally {
		isLoading.value = false;
	}
};
</script>
