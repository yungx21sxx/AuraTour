<script setup lang="ts">
	import useAuthModal from "~/modules/Auth/composables/useAuthModal";
	import useAuthStep from "~/modules/Auth/composables/useAuthStep";
	import {useAuth} from "~/modules/Auth/composables/useAuth";
	import { mdiClose } from '@mdi/js';
	import RegisrationForm from "~/modules/Auth/components/RegisrationForm.vue";
	import LoginForm from "~/modules/Auth/components/LoginForm.vue";
	import VKAuthWidget from "~/modules/Auth/components/VKAuthWidget.vue";
	import OtpConfirmForm from "~/modules/Auth/components/OtpConfirmForm.vue";
	import type {IAuthUser} from "~/modules/Auth/types/user.types";
	const {authModalIsOpen, closeAuthModal} = useAuthModal();
	const hideVKAuth = ref(false);
	
	const {isMobile} = useDevice();
	
	const {authStep, updateAuthStep, resetAuthStep} = useAuthStep();
	
	function onLoginSuccess(email: string) {
		updateAuthStep({
			step: "CONFIRM-CODE",
			authType: "LOGIN",
			email: email,
		})
	}
	
	function onRegistrationSuccess(email: string) {
		updateAuthStep({
			step: "CONFIRM-CODE",
			authType: "REGISTRATION",
			email: email,
		})
	}
	
	function onAuthSuccess(userResponse: IAuthUser) {
		const {setAuthUser} = useAuth();
		setAuthUser(userResponse);
		resetAuthStep();
		closeAuthModal();
	}
	
</script>

<template>
	<v-dialog
		v-model="authModalIsOpen"
		:fullscreen="isMobile"
		max-width="500px"
		min-height="600px"
	>
		<v-card class="modal">
			<v-card-item>
				<div class="modal__header">
					<v-btn class="close-btn" color="#7059FF" :icon="mdiClose" @click="closeAuthModal" variant="tonal" density="comfortable"/>
				</div>
				
				<v-window v-model="authStep.step">
					<v-window-item value="AUTH-PENDING">
						<h2 class="title text-main">Войти или
							создать аккаунт</h2>
						<v-tabs
							v-model="authStep.authType"
							align-tabs="center"
							color="#7059FF"
						>
							<v-tab value="LOGIN">Вход</v-tab>
							<v-tab value="REGISTRATION">Регистрация</v-tab>
						</v-tabs>
						<v-tabs-window v-model="authStep.authType">
							<v-tabs-window-item value="LOGIN">
								<LoginForm @on-success="onLoginSuccess" />
							</v-tabs-window-item>
							<v-tabs-window-item value="REGISTRATION">
								<RegisrationForm @on-success="onRegistrationSuccess" />
							</v-tabs-window-item>
						</v-tabs-window>
						<VKAuthWidget/>
					</v-window-item>
					<v-window-item value="CONFIRM-CODE">
						<OtpConfirmForm @on-success="onAuthSuccess"/>
					</v-window-item>
				</v-window>
				
				<p class="policy text-gray">Совершая авторизацию, вы соглашаетесь
					c обработкой персональных данных и условиями пользовательских соглашений</p>
			</v-card-item>
	
		</v-card>
	</v-dialog>
	

</template>

<style scoped lang="scss">

.modal {
	text-align: center;
	
	&__header {
		display: flex;
		justify-content: end;
		margin-bottom: 8px;
	}
	.title {
		margin-bottom: 16px;
		
	}
}

.policy {
	font-size: 12px;
	margin-top: 24px;
}

</style>