<script setup lang="ts">
	import {mdiClose} from "@mdi/js";
	import BtnPrimary from "~/modules/Common/UI/BtnPrimary.vue";
	import useAuthModal from "~/modules/Auth/composables/useAuthModal";
	
	const isOpen = defineModel();
	
	const {isMobile} = useDevice();
	
	const {openAuthModal} = useAuthModal()
	
	const openAuth = () => {
		isOpen.value = false;
		openAuthModal();
	}
	
	
</script>

<template>
	<v-dialog v-model="isOpen" max-width="650px" :fullscreen="isMobile">
		<v-card>
			<v-toolbar color="white">
				<v-btn :icon="mdiClose" @click="isOpen = false"/>
				<v-toolbar-title>Бонусная программа</v-toolbar-title>
			</v-toolbar>
			<v-card-text>
				<p>
					Присоединяйтесь к программе лояльности Аура Тур уже сегодня и начните экономить на своих путешествиях!
				</p>
				<BtnPrimary class="mt-4" @click="openAuth">Зарегестрироватся</BtnPrimary>
			</v-card-text>
			<v-card-item>
				<v-timeline side="end">
					<v-timeline-item size="small" dot-color="#7059FF">
						<h3>📝 Зарегестрируйтесь на сайте</h3>
						<p>Зарегистрируйтесь на сайте или автоматически станьте участником бонусной программы после первого бронирования. Ваш личный кабинет будет отслеживать все накопления и бонусы.</p>
					</v-timeline-item>
					<v-timeline-item size="small" dot-color="#7059FF">
						<h3>💰 Накапливайте бонусы</h3>
						<p>После первого подтвержденного бронирования вы получаете 3% бонусов от его суммы. Начиная со второго бронирования, возврат увеличивается до 5%. Все бонусы автоматически начисляются на ваш личный кабинет</p>
					</v-timeline-item>
					<v-timeline-item size="small" dot-color="#7059FF">
						<h3>🎁 Оплачивайте бонусами бронирования</h3>
						<p>Накопленные бонусы можно использовать для оплаты бронирования жилья. Вы можете оплатить до 100% стоимости брони, делая свой отдых максимально выгодным.</p>
					</v-timeline-item>
				</v-timeline>
			</v-card-item>
		</v-card>
	</v-dialog>
</template>

<style scoped lang="scss">
h3 {
	color: $text-main;
	margin-bottom: 16px;
}

 p {
	 font-size: 14px;
	 color: $text-gray;
 }

</style>