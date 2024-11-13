<script setup lang="ts">
import {mdiClose} from "@mdi/js";
import BtnPrimary from "~/modules/Common/UI/BtnPrimary.vue";
import useAuthModal from "~/modules/Auth/composables/useAuthModal";
import useLandLordModal from "~/modules/Common/useLandLordModal";
import {useAuthUser} from "~/modules/Auth/composables/useAuthUser";

const authUser = useAuthUser()

const isOpen = useLandLordModal();

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
				<v-toolbar-title>Сдать жилье</v-toolbar-title>
			</v-toolbar>
			<v-card-text>
				<p>
					Присоединяйтесь к крупнейшей сети посуточной аренды жилья и увеличьте доход с Аура Тур. Мы возьмем на себя все заботы: от поиска клиентов до общения с ними!
				</p>
			</v-card-text>
			<v-card-item>
				<v-timeline side="end">
					<v-timeline-item size="small" dot-color="#7059FF">
						<h3>Партнерство на выгодных условиях</h3>
						<p>Мы заключаем с вами договор управления, который гарантирует прозрачные условия: комиссия составляет всего 10% от суммы бронирования. Вы получаете стабильный доход без забот.</p>
					</v-timeline-item>
					<v-timeline-item size="small" dot-color="#7059FF">
						<h3>Вся работа с клиентами — на нас</h3>
						<p>Наша команда полностью берет на себя взаимодействие с гостями — от первого запроса до отзывов после проживания. Вы можете быть уверены в профессиональном подходе к каждому клиенту.</p>
					</v-timeline-item>
					<v-timeline-item size="small" dot-color="#7059FF">
						<h3>Максимальная выгода</h3>
						<p>Сотрудничество с Аура Тур позволяет увеличить заполняемость и доходность объекта. Мы обеспечиваем активное продвижение и рекламу вашего жилья, привлекая больше гостей.</p>
					</v-timeline-item>
				</v-timeline>
				<BtnPrimary v-if="!authUser" class="mt-4" @click="openAuth">Зарегестрироватся</BtnPrimary>
				<BtnPrimary v-else class="mt-4" href="/lk/listings">Загрузить объект</BtnPrimary>
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