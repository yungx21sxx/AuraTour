<script setup lang="ts">

import {mdiClose} from "@mdi/js";
import BtnPrimary from "~/modules/Common/UI/BtnPrimary.vue";

const isOpen = defineModel();
const {isMobile} = useDevice();

const formDataDefault = {
	phone: '',
	name: ''
}

const {fetchForCallData} = UseTelegram()

const btnText = ref('Отправить заявку')

let formDataRequest = reactive(formDataDefault);
function completeRequest() {
	btnText.value = 'Заявка отправлена'
	setTimeout(() => {
		isOpen.value = false;
	}, 1000)
}

const form = ref()
const pending = ref(false )
async function sendRequest() {
	pending.value = true;
	const { valid } = await form.value.validate()
	if (!valid) return;
	const {phone, name} = formDataRequest;
	try {
		await fetchForCallData(phone, name)
		pending.value = false;
		formDataRequest = {
			phone: '',
			name: ''
		}
	} catch (e) {
		console.log(e)
	} finally {
		completeRequest();
	}
}

const phone = ref('')

watch(phone, () => {
	console.log(phone.value)
})

</script>

<template>
	<v-dialog v-model="isOpen" :max-width="650" :fullscreen="isMobile">
		<v-card>
			<v-toolbar color="#fff">
				<v-btn :icon="mdiClose" @click="isOpen = false"/>
				<v-toolbar-title>Служба бронирования</v-toolbar-title>
			</v-toolbar>
			
			<v-card-item>
				<v-form @submit.prevent="sendRequest" class="form__body" ref="form">
					<p class="mb-6">Мы берем на себя все вопросы по организации вашего отдыха. Оставьте заявку и мы расскажем о всех доступных предложених и подберем самое лучшее для Вас.</p>
					<v-text-field variant="outlined" required :rules="[(v: string) => !!v || 'Введите имя']" label="Как вас зовут?" v-model="formDataRequest.name"/>
					<PhoneInput class="mt-2" variant="outlined"  required :rules="[(v: string) => !!v || 'Введите номер']" v-model="phone"/>
					<BtnPrimary class="mt-4 mb-4" type="submit" block :loading="pending">{{btnText}}</BtnPrimary>
				</v-form>
			</v-card-item>
		</v-card>
	</v-dialog>
</template>

<style scoped lang="scss">

</style>