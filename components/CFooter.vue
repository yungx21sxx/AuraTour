<script setup lang="ts">
import {
	mdiEmailOutline,
	mdiInstagram,
	mdiMail,
	mdiMailbox,
	mdiMapMarkerOutline,
	mdiPhoneOutline,
	mdiWrenchCogOutline
} from "@mdi/js";
import MainLogo from "~/modules/Menu/icons/MainLogo.vue";
import InstIcon from "~/modules/Pages/MainPage/Icons/InstIcon.vue";
import TelegaIcon from "~/modules/Pages/MainPage/Icons/TelegaIcon.vue";
import useAuthModal from "~/modules/Auth/composables/useAuthModal";
import {useAuthUser} from "~/modules/Auth/composables/useAuthUser";
import WhatsIcon from "~/modules/Common/icons/WhatsIcon.vue";
	
const {isMobile} = useDevice();
const {openAuthModal} = useAuthModal();
const authUser = useAuthUser()

const gotToLK = async () => {
	if (authUser.value) {
		await navigateTo('/lk/profile');
	} else {
		openAuthModal();
	}
}

</script>

<template>
	<div class="footer footer_desktop">
		<div class="wrapper footer__body">
			<div class="footer__left">
				<NuxtLink to="/" class="footer__logo" aria-label="Главная страница">
					<MainLogo variant="light"/>
				</NuxtLink>
				<div class="share mt-12">
					<h3 class="share__title">Новости и лучшие предложения</h3>
					<div class="share__links">
						<NuxtLink target="_blank" external to="https://www.instagram.com/aura_tur_abkhazia?igsh=ejVkeXV2dDV2YzB0" class="share__link">
							<InstIcon/>
							<span>Instagram</span>
						</NuxtLink>
						<div class="divider"></div>
						<NuxtLink target="_blank" external to="https://t.me/laura_tour" class="share__link">
							<TelegaIcon/>
							<span>Telegram</span>
						</NuxtLink>
					</div>
					<v-chip
						href="https://wa.me/79288514084"
						external
						color="orange"
						variant="tonal"
						class="mt-1 mb-4"
						:prepend-icon="mdiWrenchCogOutline"
						rel="nofollow"
					>
						Создание сайта
					</v-chip>
				</div>
				
			</div>
			<div class="footer__breadcrumbs">
				<h4 class="footer__title">Карта сайта</h4>
				<div class="footer__links">
					<NuxtLink to="/" class="footer__link">Главная</NuxtLink>
					<NuxtLink to="/search" class="footer__link">Поиск</NuxtLink>
					<NuxtLink rel="nofollow" to="/favorites" class="footer__link">Избранное</NuxtLink>
					<NuxtLink to="/help" class="footer__link">Помощь</NuxtLink>
					<NuxtLink to="/contacts" class="footer__link">Контакты и реквизиты</NuxtLink>
					<p @click="gotToLK" class="footer__link">Личный кабинет</p>
				</div>
				
			</div>
			<div class="footer__contacts">
				<NuxtLink class="contact" external to="tel:/+79409976702">
					<v-icon class="contact__icon" color="#7059FF" :icon="mdiPhoneOutline"></v-icon>
					<div class="contact__body">
						<div class="contact__desc">Служба поддержки</div>
						<div class="contact__text">+7 (940) 997-67-02</div>
					</div>
				</NuxtLink>
				<div class="contact">
					<v-icon class="contact__icon" color="#7059FF" :icon="mdiMapMarkerOutline"></v-icon>
					<div class="contact__body">
						<div class="contact__desc">Адрес</div>
						<div class="contact__text">г. Гудаута, Очамчирская 90</div>
					</div>
				</div>
				<NuxtLink class="contact" external to="mailto:lana.2015lana@mail.ru">
					<v-icon class="contact__icon" color="#7059FF" :icon="mdiEmailOutline"></v-icon>
					<div class="contact__body">
						<div class="contact__desc">Почта</div>
						<div class="contact__text">lana.2015lana@mail.ru</div>
					</div>
				</NuxtLink>
			</div>
			
		</div>
		
		<div class="wrapper">
			<v-divider class="mt-4"/>
			<div class="rules mt-4 d-flex">
				<p class="footer__copyright">
					© 2022-2025 Аура Тур
				</p>
				<div class="links ml-auto">
					<NuxtLink to="/obrabotka-personalnyh-dannyh" class="footer__link">Обработка персональных данных</NuxtLink>
					<NuxtLink to="/polzovatelskoe-soglashenie" class="footer__link">Пользовательское соглашение</NuxtLink>
				</div>
			</div>
		</div>
	</div>
	<div class="footer footer_mobile">
		<div class="wrapper footer__body">
			
			<NuxtLink to="/" class="footer__logo" aria-label="Главная страница">
				<NuxtIcon name="nav/text-logo-blue" class="footer__logo-text" filled/>
			</NuxtLink>
			<div class="share mt-4">
				<h3 class="share__title">Новости и лучшие предложения</h3>
				<div class="share__links">
					<NuxtLink target="_blank" external to="https://www.instagram.com/aura_tur_abkhazia?igsh=ejVkeXV2dDV2YzB0" class="share__link">
						<InstIcon/>
						<span>Instagram</span>
					</NuxtLink>
					<div class="divider"></div>
					<NuxtLink target="_blank" external to="https://t.me/laura_tour" class="share__link">
						<TelegaIcon/>
						<span>Telegram</span>
					</NuxtLink>
				</div>
				<v-chip
					href="https://wa.me/79288514084"
					external
					color="orange"
					variant="tonal"
					class="mt-1 mb-4"
					:prepend-icon="mdiWrenchCogOutline"
					rel="nofollow"
				>
					Создание сайта
				</v-chip>
			</div>
			
			<div class="footer__contacts">
				<NuxtLink class="contact" to="tel:/+79409976702">
					<v-icon class="contact__icon" color="#7059FF" :icon="mdiPhoneOutline"></v-icon>
					<div class="contact__body">
						<div class="contact__desc">Служба поддержки</div>
						<div class="contact__text">+7 (940) 997-67-02</div>
					</div>
				</NuxtLink>
				<div class="contact">
					<v-icon class="contact__icon" color="#7059FF" :icon="mdiMapMarkerOutline"></v-icon>
					<div class="contact__body">
						<div class="contact__desc">Адрес</div>
						<div class="contact__text">г. Гудаута, Очамчирская 90</div>
					</div>
				</div>
				<NuxtLink class="contact" to="mailto:lana.2015lana@mail.ru">
					<v-icon class="contact__icon" color="#7059FF" :icon="mdiEmailOutline"></v-icon>
					<div class="contact__body">
						<div class="contact__desc">Почта</div>
						<div class="contact__text">lana.2015lana@mail.ru</div>
					</div>
				</NuxtLink>
			</div>
			
			<div class="footer__breadcrumbs">
				<h4 class="footer__title">Карта сайта</h4>
				<div class="footer__links">
					<NuxtLink to="/" class="footer__link">Главная</NuxtLink>
					<NuxtLink to="/search" class="footer__link">Поиск</NuxtLink>
					<NuxtLink to="/favorites" rel="nofollow" class="footer__link">Избранное</NuxtLink>
					<NuxtLink to="/help" class="footer__link">Помощь</NuxtLink>
					<NuxtLink to="/contacts" class="footer__link">Контакты и реквизиты</NuxtLink>
					<p  @click="gotToLK" class="footer__link">Личный кабинет</p>
				</div>
			
			</div>
			
			<v-divider class="mt-4"/>
			<div class="rules mt-4">
				<p class="footer__copyright">
					© 2022-2025 Аура Тур
				</p>
				<div class="links mt-4">
					<NuxtLink to="/obrabotka-personalnyh-dannyh" class="footer__link d-block">Обработка персональных данных</NuxtLink>
					<NuxtLink to="/polzovatelskoe-soglashenie" class="footer__link d-block">Пользовательское соглашение</NuxtLink>
				</div>
			</div>
			
		</div>
	</div>
	
</template>

<style scoped lang="scss">
	.rules .footer__link {
		font-size: 14px;
	}
	.share__title {
		color: rgba(white, .9);
		margin-bottom: 16px;
		font-size: 14px;
		font-weight: 500;
	}
	
	.share__link {
		display: flex;
		gap: 10px;
		color: #FFFFFF;
		align-items: center;
	}
	.divider {
		width: 1px;
		height: 24px;
		background: rgba(white, .8);
	}
	
	.share__links {
		display: flex;
		align-items: center;
		gap: 16px;
		margin-bottom: 24px;
	}

	.footer_desktop {
		display: block;
	}
	.footer_mobile {
		display: none;
	}
	
	@media screen and (max-width: 700px){
		.footer_desktop {
			display: none;
		}
		.footer_mobile {
			display: block;
		}
	}
	//Общие стили
	.footer {
		color: white;
		background: #2A2536;
		padding: 32px 0;
		margin-top: 48px;
		
		&__logo {
			display: flex;
			align-items: center;
			gap: 8px;
			
			img {
				height: 30px;
			}
		}
		
		&__description {
			font-size: 12px;
		}
		
		&__copyright {
			color: $light-gray;
		}
		
		&__logo {
			margin-bottom: 16px;
		}
		
		.contact {
			display: flex;
			align-items: center;
			gap: 8px;
			margin-bottom: 16px;
			color: $light-gray;
			&__desc {
				font-size: 12px;
				color: $light-gray;
			}
		}
		
		&__title {
			margin-bottom: 16px;
		}
		&__links {
			display: flex;
			
			flex-wrap: wrap;
		}
		&__link {
			color: $light-gray;
			margin-right: 24px;
			margin-bottom: 16px;
			cursor: pointer;
		}
	}
	
	.footer_desktop .footer {
		&__body {
			display: grid;
			grid-template-columns: repeat(3, 1fr);
			gap: 48px;
			justify-content: space-between;
		}
		
		
		&__description {
			margin-bottom: 16px;
		}
		
	
	}
	
	.footer_mobile .footer {
		&__logo {
			margin-bottom: 24px;
		}
		&__breadcrumbs {
			margin-top: 24px;
			margin-bottom: 24px;
		}
		
	}
</style>