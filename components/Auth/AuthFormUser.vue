<script setup lang="ts">
	import type {UserLoginDTO} from "~/types/dto.types";
	
	const { login, setUser, authModalIsOpen } = useAuth();
	
	const phone = ref<string>("");
	const phoneRow = ref<string>("");
	const phoneFromCache = ref<string>('');
	const createOTPError = ref<string>('');
	const confirmOTPError = ref<string>('');
	const currentStep = ref<number>(1);
	const otp = ref<string>("");
	const isMobile = true;
	const countdown = ref<number>(60);
	const isOtpReset = ref<boolean>(false);
	
	function startCountdown() {
		const intervalId = setInterval(() => {
			if (countdown.value > 0) {
				countdown.value -= 1;
			} else {
				clearInterval(intervalId);
			}
		}, 1000);
	}
	
	const getPhoneRow = (phoneRowValue: string) => {
		phoneRow.value = phoneRowValue
	}
	
	// defineEmits<{
	// 	(event: 'onLogin'): void,
	// 	(event: 'onError', message: string): void
	// }>();
	//
	
	onMounted(() => {
		const phoneData: string | null = localStorage.getItem('phone');
		if (phoneData) {
			phoneFromCache.value = phoneData;
		}
	})
	
	async function createOTP() {
		if (phone.value === '') {
			createOTPError.value = 'Необходимо ввести номер.'
			return;
		}
		const { data, error } = await useFetch('/api/user/create-otp', {
			method: 'post',
			body: { phoneRow: `7${phoneRow.value}` },
		})
		if (error.value) {
			createOTPError.value = error.value.statusMessage || '';
			return;
		}
		if (data.value) {
			localStorage.setItem('phone', phone.value);
		}
		if (!isOtpReset.value) {
			nextStep();
		}
	}
	
	async function loginConfirm() {
		const dto: UserLoginDTO = {
			otp: parseInt(otp.value),
			phone: `+7 ${phone.value}`,
			phoneRaw: `7${phoneRow.value}`
		}
		
		const {data: user, error} = await useFetch('/api/user/login', {
			method: "POST",
			body: dto,
		})
		
		if (error.value) {
			confirmOTPError.value = error.value.data.statusMessage;
			return;
		}
		//@ts-ignore
		setUser(user.value);
		localStorage.removeItem('phone');
		
		authModalIsOpen.value = false;
		
	}
	
	async function resetOtp() {
		try {
			await useFetch('/api/user/reset-otp', {
				method: 'POST',
				body: {phoneRow: `7${phoneRow.value}`}
			});
			isOtpReset.value = true;
			countdown.value = 60;
			startCountdown();
			await createOTP();
		} catch (e) {
			console.log(e);
		}
	}
	
	async function resetPhone() {
		phoneRow.value = phone.value = createOTPError.value = confirmOTPError.value =  '';
		localStorage.removeItem('phone');
		await resetOtp();
		prevStep();
	}
	const nextStep = () => {
		if (
			(phoneRow.value !== '' && phoneRow.value.length === 10) ||
			phoneFromCache.value !== ''
		) {
			currentStep.value += 1;
			startCountdown();
		} else {
			createOTPError.value = 'Необходимо ввести номер.';
		}
	}
	
	const prevStep = () => currentStep.value -= 1

</script>

<template>
	<div class="form">
		<v-window v-model="currentStep">
			<v-window-item :value="1">
				<h3 class="form__title">
					Войти или <br> создать аккаунт
				</h3>
				<p class="form__description">
					Введите свой номер телефона,
					а мы отправим код в СМС
				</p>
				<PhoneInput v-model="phone" class="form__phone-input" @update-row-value="getPhoneRow"/>
				<p class="form__error mb-4" v-if="createOTPError !== ''">{{ createOTPError }}</p>
			
				<v-btn class="form__confirm-btn" @click="createOTP" color="#7059FF">Получить СМС</v-btn>
				<v-btn class="form__btn-next" @click="nextStep" variant="tonal" color="#7059FF">Уже есть код?</v-btn>
			</v-window-item>
			
			<v-window-item :value="2">
				<div class="form__otp">
					<p class="form__description form__phone-info">
						Код отправлен на номер: +7 {{ phone !== '' ? phone : phoneFromCache }}. <br> Действителен в течении 5 минут.<br>
						<v-btn variant="text" color="#c93" class="form__confirm-btn" @click="resetPhone">Изменить номер</v-btn>
					</p>
					<v-otp-input class="form__otp-input" v-model="otp"/>
					<div class="form__otp-error">
						<p class="form__error form__error_opt mb-4" v-if="confirmOTPError !== ''">
							{{ confirmOTPError }}
						</p>
						
					</div>
					<p class="form__count-down" v-if="countdown > 1">Новый код можно запрсить через: {{ countdown }}</p>
					<v-btn variant="text" color="#7059FF" class="form__confirm-btn" v-else @click="resetOtp">Запросить новый код</v-btn>
				
					<v-btn @click="loginConfirm" class="form__confirm-btn mt-4" color="#7059FF">Подтвердить код</v-btn>
				</div>
				
			</v-window-item>
			<v-window-item :value="3">
			
			</v-window-item>
		</v-window>
		
	</div>
</template>

<style scoped lang="scss">
	.form {
		
		&__title {
			
			font-size: 24px;
		}
		
		
		&__phone-info {
			margin-bottom: 8px !important;
		}
		
		&__count-down {
			text-align: center;
		}
		
		&__btn-next {
			margin-top: 16px;
		}
		
		.form__description {
			margin-bottom: 24px;
			
			margin-top: 16px;
		}
		
		.form__confirm-btn, &__btn-next {
			display: block;
			width: 100%;
			
		}
		
		.form__error {
			text-align: center;
			color: #ff8989;
		}
		
		.form__otp .form__description {
			text-align: center;
		}
	}
	.bonus {
		
		&__timeline {
			margin-bottom: 16px;
		}
		&__subtitle {
			font-size: 20px;
			&_orange {
				color: #D19D34;
			}
			&_white {
				margin-bottom: 24px;
			}
		}
		
		
	}
	
	.mb {
		//margin-bottom: 16px;
	}
	
	.v-timeline--vertical.v-timeline {
		height: auto !important;
	}

</style>