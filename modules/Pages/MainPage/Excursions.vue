<script setup lang="ts">



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
		btnText.value = 'Отправить заявку'
		formDataRequest = formDataDefault;
	}, 2000)
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
	}
	
	completeRequest();
}

const phone = ref('')

watch(phone, () => {
	console.log(phone.value)
})

</script>

<template>
	<div class="wrapper">
		<div class="form block">
			<v-form @submit.prevent="sendRequest" class="form__body" ref="form">
				<h3 class="form__title">
					Служба бронирования
				</h3>
				<p class="form__info">
					Мы берем на себя все вопросы по организации вашего отдыха. Оставьте заявку и мы расскажем о всех доступных предложених и подберем самое лучшее для Вас.
				</p>
				<v-text-field variant="outlined" required :rules="[(v: string) => !!v || 'Введите имя']" label="Как вас зовут?" v-model="formDataRequest.name"/>
				<PhoneInput  required :rules="[(v: string) => !!v || 'Введите номер']" v-model="phone"/>
				<v-btn color="#7059FF" type="submit" block :loading="pending">{{btnText}}</v-btn>
			</v-form>
			<v-img src="/main-page/submit.webp" class="form__img" cover/>
		</div>
	</div>

</template>

<style scoped lang="scss">

.form {
	
	
	
	margin-top: 48px;
	display: grid;
	grid-template-columns: 1fr 1.2fr;
	gap: 64px;
	border-radius: 12px;
	background: #FFFFFF;
	
	
	
	&__title {
		font-size: 24px;
		margin-bottom: 16px;
	}
	&__info {
		margin-bottom: 32px;
	}
	
	&__img {
		border-radius: 12px;
		height: 350px;
	}
	@media screen and (max-width: 860px) {
		grid-template-columns: 1fr;
		margin-top: 32px !important;
		gap: 16px;
		&__img {
			border-radius: 12px !important;
			height: 200px;
		}
		
		&__body {
			margin: 16px !important;
		}
	}
}


</style>