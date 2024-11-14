<script setup lang="ts">


import MenuMain from "~/modules/Menu/components/MenuMain.vue";
import useSearch from "~/modules/Booking/composables/useSearch";
import AccessIcon from "~/modules/Pages/About/icons/AccessIcon.vue";
import ConsultIcon from "~/modules/Pages/About/icons/ConsultIcon.vue";
import TransferIcon from "~/modules/Pages/About/icons/TransferIcon.vue";
import {mdiInstagram, mdiMapMarkerOutline, mdiPhoneOutline} from "@mdi/js";

const breadcrumbs = [
	{
		title: 'Главная',
		disabled: false,
		href: '/',
	},
	{
		title: 'О нас',
		disabled: true,
		href: '/',
	}
]

const {searchData} = useSearch()
</script>

<template>

	<header class="header">
		<MenuMain variant="light" class="header__menu"/>
		<div class="wrapper header__wrapper">
			<v-breadcrumbs :items="breadcrumbs" class="header__breadcrumbs"/>
			<h1 class="header__title">Аура Тур — ваш гид по незабываемому отдыху в Абхазии</h1>
			<p class="header__text">Более 300 вариантов жилья, персональный подход и полный спектр услуг
				для вашего идеального отпуска.</p>
			
			<div class="header__types">
				<div class="header__types">
					Смотреть жилье
				</div>
				<v-chip-group show-arrow>
					<v-chip
						v-for="type of searchData.listingTypes"
						variant="outlined"
						:key="type.id"
						:href="`/search/?housingTypesId=${type.id}`"
					>{{type.name}}</v-chip>
				</v-chip-group>
			</div>
		</div>
	</header>
	<div class="wrapper">
		<h2 class="title">Наши услуги</h2>
		<div class="services">
			<div class="service">
				<AccessIcon/>
				<h4 class="service__title">Персональный подбор жилья</h4>
				<p class="service__text">Поможем вам найти идеальное место для отдыха,.</p>
			</div>
			<div class="service">
				<TransferIcon/>
				<h4 class="service__title">Трансферы и экскурсии</h4>
				<p class="service__text">Организуем трансферы и экскурсии через наших надежных партнеров.</p>
			</div>
			<div class="service">
				<ConsultIcon/>
				<h4 class="service__title">Бесплатные консультации</h4>
				<p class="service__text">Бесплатные советы по всем вопросам: куда сходить, что посмотреть.</p>
			</div>
		</div>
		<div style="display: flex; justify-content: center; margin-top: 16px; flex-direction: column; align-items: center">
			<div class="about-text">
				<h3>Добро пожаловать в <span>Аура Тур!</span>  </h3>
				Мы — ваш надежный партнер в организации незабываемого отдыха в Абхазии. Предлагая более 300 проверенных объектов, мы помогаем путешественникам найти идеальное жилье для отдыха. Возьмем на себя все организационные вопросы и связывая вас с лучшими предложениями региона.
			</div>
			<div class="contacts-page">
			<div class="contacts">
				<h2 class="mb-4">Контакты</h2>
				<NuxtLink class="contact" to="tel:/+79409976702">
					<v-icon class="contact__icon" color="#7059FF" :icon="mdiPhoneOutline"></v-icon>
					<div class="contact__body">
						<div class="contact__desc">Служба поддержки</div>
						<div class="contact__text">+7 (940) 997-67-02</div>
					</div>
				</NuxtLink>
				<NuxtLink class="contact">
					<v-icon class="contact__icon" color="#7059FF" :icon="mdiMapMarkerOutline"></v-icon>
					<div class="contact__body">
						<div class="contact__desc">Адрес</div>
						<div class="contact__text">г. Гудаута, Очамчирская 90</div>
					</div>
				</NuxtLink>
				<NuxtLink class="contact" to="https://www.instagram.com/reel/C3-uB8sIlkW/?igsh=MXE4OTM4djBqcDZsNA==">
					<v-icon class="contact__icon" color="#7059FF" :icon="mdiInstagram"></v-icon>
					<div class="contact__body">
						<div class="contact__desc">Мы в Instagram</div>
						<div class="contact__text">aura_tur_abkhazia</div>
					</div>
				</NuxtLink>
			</div>
			<div class="map">
				<iframe
					class="map__frame"
					src="https://yandex.ru/map-widget/v1/?ll=40.616670%2C43.102695&mode=search&oid=181680253232&ol=biz&sctx=ZAAAAAgBEAAaKAoSCY9WtaSjUD5AEQgB%2BRIq%2BE1AEhIJ8bkT7L%2FO9j8Rfa8hOC7j2T8iBgABAgMEBSgKOABAAkgBagJydZ0BzcxMPaABAKgBAL0BsYfa28IBBrDS8uekBYICHtCw0YPRgNCwINGC0YPRgCDQsNCx0YXQsNC30LjRj4oCAJICBTI5Mzg2mgIMZGVza3RvcC1tYXBz&sll=40.616670%2C43.102695&sspn=0.015004%2C0.006217&text=%D0%B0%D1%83%D1%80%D0%B0%20%D1%82%D1%83%D1%80%20%D0%B0%D0%B1%D1%85%D0%B0%D0%B7%D0%B8%D1%8F&z=17.57"
					style="position:relative; width: 100%; height: 100%;"
				></iframe>
			</div>
		</div>
		</div>
		
		
	
	</div>
	
</template>

<style scoped lang="scss">

.header {
	background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.1)), url("/seo/listing-type.jpg");
	display: flex;
	flex-direction: column;
	justify-content: center;
	padding-top: 100px;
	padding-bottom: 100px;
	background-position: center center;
	background-repeat: no-repeat;
	background-size: cover;
	
	&__types {
		color: #fff;
		margin-bottom: 8px;
		font-weight: bold;
	}
	
	&__text {
		color: #fff;
		max-width: 600px;
		margin-bottom: 32px;
	}
	
	&__menu {
		position: absolute;
		top: 10px;
		width: 100%;
	}
	
	&__breadcrumbs {
		color: #fff;
		margin-bottom: 24px;
	}
	
	&__title {
		font-size: 32px;
		color: #fff;
		margin-bottom: 16px;
		max-width: 800px;
	}
	
	@media screen and (max-width: 950px) {
		
		&__title {
			font-size: 32px;
		}
	}
	
	@media screen and (max-width: 440px) {
		
		&__title {
			font-size: 24px;
		}
	}
	
	
}

.title {
	font-size: 32px;
	margin-top: 32px;
	text-align: center;
}

.services {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	margin-top: 24px;
	text-align: center;
	gap: 24px;
}
@media screen and (max-width: 710px) {
	.services {
		grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
	}
	.title {
		font-size: 24px;
	}
	
}


.service {
	box-shadow: $elevation;
	
	
	background: #FFFFFF;
	border-radius: 10px;
	padding: 24px 16px;
	&__icon {
		display: block;
	}
	&__text {
		color: $text-gray;
	}
	
	&__title {
		font-size: 18px;
		margin-bottom: 8px;
		margin-top: 16px;
		color: $text-main;
	}
}

.about-text {
	text-align: center;
	max-width: 800px;
	font-size: 18px;
	font-weight: 500;
	color: $text-main;
}

h3 {
	margin-bottom: 16px;
	margin-top: 24px;
	span {
		color: $accent-blue;
	}
}
.contacts-page {
	
	max-width: 800px;
	width: 100%;
	margin-top: 48px;
	display: flex;
	gap: 48px;
	
	.contacts {
		margin-top: 16px;
		width: 400px;
	}
	@media screen and (max-width: 700px) {
		flex-direction: column;
		
		.contacts {
			width: auto;
		}
	}
	
	
	
	
	
	
}

.map {
	width: 100%;
	height: 400px;
	
	&__frame {
		border-radius: 10px;
		border: none;
	}
}

.bank p {
	margin-top: 8px;
}

.contact {
	display: flex;
	align-items: center;
	gap: 8px;
	margin-bottom: 24px;
	color: $text-main;
	
	&__desc {
		font-size: 12px;
		color: $text-gray;
	}
}


</style>