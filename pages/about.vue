<script setup lang="ts">


import MenuMain from "~/modules/Menu/components/MenuMain.vue";
import useSearch from "~/modules/Booking/composables/useSearch";
import AccessIcon from "~/modules/Pages/About/icons/AccessIcon.vue";
import ConsultIcon from "~/modules/Pages/About/icons/ConsultIcon.vue";
import TransferIcon from "~/modules/Pages/About/icons/TransferIcon.vue";
import {mdiInstagram, mdiMapMarkerOutline, mdiPhoneOutline} from "@mdi/js";
import CallBackForm from "~/modules/Common/CallBackForm.vue";
import TourBanner from "~/modules/Pages/MainPage/TourBanner.vue";
import PassListingBanner from "~/modules/Pages/MainPage/PassListingBanner.vue";

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

useSeoMeta({
	title: 'Аура Тур — ваш гид по незабываемому отдыху в Абхазии',
	description: 'Более 400 вариантов жилья, персональный подход и полный спектр услуг для вашего идеального отпуска.'
})
</script>

<template>

	<header class="header">
		<MenuMain variant="light" class="header__menu"/>
		<div class="wrapper header__wrapper">
			<v-breadcrumbs :items="breadcrumbs" class="header__breadcrumbs"/>
			<h1 class="header__title">Аура Тур — ваш гид по незабываемому отдыху в Абхазии</h1>
			<p class="header__text">Более 400 вариантов жилья, персональный подход и полный спектр услуг
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
						:href="`/search/type/${type.slug}`"
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
		<div class="wrapper">
			<TourBanner/>
		</div>
		<div style="display: flex; justify-content: center; margin-top: 16px; flex-direction: column; align-items: center">
			<div class="about-text">
				<h2>Добро пожаловать в <span>Аура Тур!</span>  </h2>
				<p class="mb-12">
					Мы — ваш надежный партнер в организации незабываемого отдыха в Абхазии. Предлагая более 400 проверенных объектов, мы помогаем путешественникам найти идеальное жилье для отдыха. Возьмем на себя все организационные вопросы и связывая вас с лучшими предложениями региона.
				</p>
			</div>
			<CallBackForm/>
		</div>
		<PassListingBanner/>
		
	
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

h2 {
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