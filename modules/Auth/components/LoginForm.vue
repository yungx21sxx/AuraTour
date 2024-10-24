<template>
	<v-form ref="formRef" @submit.prevent="submit" style="margin: 24px 0">
		<p class="text-gray" style="margin-bottom: 16px;">Введите свою электронную почту, затем мы отправим на нее код подтверждения.</p>
		<v-text-field
			v-model="emailInput"
			label="Почта"
			:rules="emailRules"
			style="margin-bottom: 16px;"
			required
		></v-text-field>
		
		<BtnPrimary
			type="submit"
			:loading="isLoading"
			block
		>
			Получить код
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
import { useNuxtApp } from '#app';
import BtnPrimary from "~/modules/Common/UI/BtnPrimary.vue";
import {AuthAPI} from "~/modules/Auth/api/auth.api";
import type {H3Error} from "h3";

const emit = defineEmits(['onSuccess']);

const formRef = ref();

const emailInput = ref('');

const isLoading = ref(false);
const serverErrors = ref<string[]>([]);

const emailRules = [
	(v: string) => !!v || 'Почта обязательна для заполнения',
	(v: string) => /.+@.+\..+/.test(v) || 'Некорректный формат почты',
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
		const { email } = await AuthAPI.login({
			email: emailInput.value,
		});
		emit('onSuccess', email);
	} catch (error: H3Error) {
		if (error && error.data) {
			serverErrors.value = [error.data.message];
		} else {
			serverErrors.value = ['Произошла ошибка при входе в аккаунт'];
		}
	} finally {
		isLoading.value = false;
	}
};
</script>
