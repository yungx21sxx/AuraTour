<script setup lang="ts">

import PhoneIcon from "~/modules/Common/icons/PhoneIcon.vue";
import WhatsIcon from "~/modules/Common/icons/WhatsIcon.vue";
import TelegaIcon from "~/modules/Common/icons/TelegaIcon.vue";
import AddressIcon from "~/modules/Common/icons/AddressIcon.vue";
import MailIcon from "~/modules/Common/icons/MailIcon.vue";
import BtnPrimary from "~/modules/Common/UI/BtnPrimary.vue";
import {ref} from "vue";
import {parsePhone} from "~/modules/Common/Utils/phone.utils";
import useTelegram from "~/composables/UseTelegram";
const snackbar = ref(false)
const formData = ref({
	name: null,
	phone: null,
	question: null
})

const rule = [
	(v: string) => !!v || 'Поле обязательно для заполнения',
]
const formRef = ref();
const isLoading = ref(false);
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
	
	try {
		const {fetchForCallData} = useTelegram()
		await fetchForCallData(formData.value.phone, formData.value.name, formData.value.question);
		snackbar.value = true;
	} catch (e) {
		alert('Произошла ошибка при отправке!');
	} finally {
		isLoading.value = false;
	}
}



</script>

<template>
	<v-snackbar
		v-model="snackbar"
	>
		Заявка успешно отправлена!
		
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

	<div class="grid wrapper">
			<div class="contacts">
				<h2>Служба бронирования</h2>
				<p>Расскажем о всех доступных предложених и подберем самое лучшее.</p>
				<div class="contacts__item">
					<PhoneIcon class="contacts__icon"/>
					<div class="contacts__info">
						<div class="contacts__title">
							Телефон
						</div>
						<NuxtLink external target="_blank" to="tel://+79409976702" class="contacts__text">
							+7 (940) 997-67-02
						</NuxtLink>
						<div class="contacts__chips">
							<NuxtLink class="contact__link" target="_blank" to="https://wa.me/79409976702" external>
								<WhatsIcon/>
								<span>WhatsApp</span>
							</NuxtLink>
							<NuxtLink class="contact__link" target="_blank" to="https://t.me/Laura555auratur" external>
								<TelegaIcon/>
								<span>Telegram</span>
							</NuxtLink>
						</div>
					</div>
				</div>
				<div class="contacts__item">
					<AddressIcon class="contacts__icon"/>
					<div class="contacts__info">
						<div class="contacts__title">
							Адрес
						</div>
						<div class="contacts__text">
							г. Гудаута, Очамчирская 89
						</div>
					</div>
				</div>
				<div class="contacts__item">
					<MailIcon class="contacts__icon"/>
					<div class="contacts__info">
						<div class="contacts__title">
							Почта
						</div>
						<NuxtLink to="mailto:lana.2015lana@mail.ru" external target="_blank" class="contacts__text">
							lana.2015lana@mail.ru
						</NuxtLink>
					</div>
				</div>
			</div>
			<v-form class="form" ref="formRef" @submit.prevent="submit" >
				<h3>Оставить заявку</h3>
				<v-text-field :rules="rule" variant="outlined" label="Ваше имя" v-model="formData.name"/>
				<v-text-field label="Номер телефона" :rules="rule" variant="outlined" v-model="formData.phone"/>
				<v-textarea label="Пожелания (необязательно)" v-model="formData.question" variant="outlined"/>
				<BtnPrimary :loading="isLoading" type="submit" block>Отправить заявку</BtnPrimary>
			</v-form>
		</div>
	
	
</template>

<style scoped lang="scss">
	
	.grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 40px;
		padding-bottom: 42px;
		padding-top: 42px;
		margin-bottom: 42px;
		
		@media screen and (max-width: 600px) {
			grid-template-columns: 1fr;
		}
	}

	.form {
		padding: 20px 30px;
		box-shadow: 0 4px 18px rgba(0,0,0,0.07);
		border-radius: 8px;
		
		@media screen and (max-width: 500px){
			padding: 10px 16px;
		}
		
		h3 {
			margin-bottom: 24px;
		}
		
		input {
			margin-bottom: 16px;
		}
	}

	.contacts {
		h2 {
			margin-bottom: 8px;
		}
		p {
			color: #637381;
			margin-bottom: 32px;
		}
		
		.contacts__item {
			display: flex;
			gap: 24px;
			margin-bottom: 32px;
		}
		
		.contacts__title {
			font-size: 18px;
			font-weight: bold;
			margin-bottom: 6px;
		}
		
		.contacts__text {
			color: #637381;
		}
		
		.contacts__chips {
			display: flex;
			margin-top: 16px;
			gap: 16px;
			flex-wrap: wrap;
		}
		
		.contact__link {
			display: flex;
			gap: 8px;
			align-items: center;
			border-radius: 999px;
			background: #F1F3F9;
			padding: 8px;
		}
	}

</style>