<script setup lang="ts">

import useAuthModal from "~/modules/Auth/composables/useAuthModal";
const {authModalIsOpen} = useAuthModal();
function loadVKIDScript() {
	return new Promise((resolve, reject) => {
		if (window.VKIDSDK) {
			// Скрипт уже загружен
			resolve(window.VKIDSDK);
			return;
		}
		
		const script = document.createElement('script');
		script.src = 'https://unpkg.com/@vkid/sdk@<3.0.0/dist-sdk/umd/index.js';
		script.async = true;
		script.onload = () => resolve(window.VKIDSDK);
		script.onerror = () => reject(new Error('Failed to load VKID SDK script.'));
		document.head.appendChild(script);
	});
}
const vkAuthIsLoaded = ref(false);
onMounted(() => {
	loadVKIDScript()
		.then(VKID => {
			vkAuthIsLoaded.value = true;
			VKID.Config.init({
				app: 52476950,
				redirectUrl: 'https://aura-tour-abkhazia.ru/api/auth/vk/callback',
				responseMode: VKID.ConfigResponseMode.Callback,
				source: VKID.ConfigSource.LOWCODE,
			});
			
			const oneTap = new VKID.OneTap();
			
			oneTap.render({
				container: document.getElementById('vk-widget-container'),
				showAlternativeLogin: true,
				oauthList: [
					'ok_ru',
					'mail_ru'
				]
			})
				.on(VKID.WidgetEvents.ERROR, vkidOnError)
				.on(VKID.OneTapInternalEvents.LOGIN_SUCCESS, function (payload) {
					const code = payload.code;
					const deviceId = payload.device_id;
					
					VKID.Auth.exchangeCode(code, deviceId)
						.then(vkidOnSuccess)
						.catch(vkidOnError);
				});
			
			
			function vkidOnSuccess(data) {
				// Обработка успешной авторизации
			}
			
			function vkidOnError(error) {
				// Обработка ошибки
			}
			
		})
		.catch(error => {
			console.error(error);
		})
})




</script>

<template>
	<transition name="fade">
		<div v-if="vkAuthIsLoaded">
			<strong class="text-main">Воити или зарегестрироваться через соц. сети</strong>
			<div id="vk-widget-container"></div>
		</div>
	</transition>
</template>

<style scoped lang="scss">

</style>