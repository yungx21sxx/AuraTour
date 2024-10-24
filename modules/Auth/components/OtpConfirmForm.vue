<template>
	<v-form ref="formRef" @submit.prevent="submit">
		<h2 class="title text-main">Подтвердите ваш код</h2>
		<p class="info">Мы отправили код подтверждения на адрес <span class="text-main">{{maskEmail(authStep.email)}}</span>. Пожалуйста, проверьте вашу почту и введите код ниже.</p>
		<v-otp-input
			v-model="otpCode"
			length="6"
			type="number"
			:rules="otpRules"
			auto-focus
		></v-otp-input>
		
		<BtnPrimary
			type="submit"
			:loading="isLoading"
			class="btn"
			width="200px"
		>
			Подтвердить
		</BtnPrimary>
		<div class="text-caption action">
			Не получили код? <a href="#" @click.prevent="sendNewCode">{{!isResendDisabled ? 'Отправить новый' : `Повторно отправить через ${remainingTime}с`}}</a>
		</div>
		<div class="text-caption">
			Изменить почту? <a href="#" @click.prevent="stepBack">Вернуться назад</a>
		</div>
		
		<div v-if="serverErrors.length" style="color: red; margin-top: 16px;">
			<ul>
				<li v-for="(error, index) in serverErrors" :key="index">
					{{ error }}
				</li>
			</ul>
		</div>
	</v-form>
</template>

<style scoped lang="scss">
	.info {
		font-size: 14px;
		margin-top: 16px;
		margin-bottom: 16px;
		color: $text-gray
	}
	.btn {
		margin-top: 16px;
		margin-bottom: 16px;
	}
	
	.action {
		margin-bottom: 8px;
	}

</style>

<script lang="ts" setup>
import { ref, defineEmits } from 'vue';
import useAuthStep from "~/modules/Auth/composables/useAuthStep";
import {AuthAPI} from "~/modules/Auth/api/auth.api";
import type {VForm} from "vuetify/components";
import type {IAuthUser} from "~/modules/Auth/types/user.types";
import type {H3Error} from "h3";

import BtnPrimary from "~/modules/Common/UI/BtnPrimary.vue";
import BtnSecondary from "~/modules/Common/UI/BtnSecondary.vue";

const maskEmail = (email) => {
	const [localPart, domain] = email.split('@');
	// Оставляем первые 2 символа локальной части и заменяем остальное на точки
	const maskedLocalPart = localPart.length > 2 ? `${localPart.substring(0, 2)}...` : localPart;
	return `${maskedLocalPart}@${domain}`;
};

const {authStep, updateAuthStep} = useAuthStep();

const emit = defineEmits<{
	onSuccess: IAuthUser;
}>();

const formRef = ref<InstanceType<typeof VForm>>();
const isResendDisabled = ref(true);
const remainingTime = ref(60);
let resendInterval: NodeJS.Timeout | null = null;

function stepBack() {
	updateAuthStep({
		step: "AUTH-PENDING",
		authType: authStep.value.authType,
		email: authStep.value.email,
	})
}


const startResendTimer = () => {
	isResendDisabled.value = true;
	remainingTime.value = 60;
	
	resendInterval = setInterval(() => {
		if (remainingTime.value > 0) {
			remainingTime.value--;
		} else {
			clearInterval(resendInterval as NodeJS.Timeout);
			isResendDisabled.value = false;
		}
	}, 1000);
};

startResendTimer();

async function sendNewCode() {
	try {
		if (isResendDisabled.value) return;
		
		await $fetch('/api/auth/send-verification-code', {
			method: "POST",
			body: {
				email: authStep.value.email,
			}
		})
		startResendTimer()
	} catch (error) {
		console.log(error)
		if (error && error.data) {
			serverErrors.value = [error.data.message];
		} else {
			serverErrors.value = ['Произошла ошибка при подтверждении кода'];
		}
	}
}

const otpCode = ref('');
const isLoading = ref(false);
const serverErrors = ref<string[]>([]);

const otpRules = [
	(v: string) => !!v || 'Код обязателен для заполнения',
	(v: string) => v.length === 6 || 'Код должен содержать 6 цифр',
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
		const user = await AuthAPI.verifyAuth(authStep.value.authType, {
			email: authStep.value.email,
			code: otpCode.value
		})
		emit('onSuccess', user);
	} catch (error: H3Error) {
		if (error && error.data) {
			serverErrors.value = [error.data.message];
		} else {
			serverErrors.value = ['Произошла ошибка при подтверждении кода'];
		}
	} finally {
		isLoading.value = false;
	}
	
};
</script>
