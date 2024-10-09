<script setup lang="ts">
	const {isMobile} = useDevice();
	const authUser = useAuthUser();
	const {authModalIsOpen} = useAuth()
	const goToLK = async () => {
		if (authUser.value) {
			await navigateTo({
				path: '/lk/bookings'
			})
			return;
		}
		authModalIsOpen.value = true
	}

</script>

<template>
	<div v-if="!isMobile" class="footer footer_desktop">
		<div class="wrapper footer__body">
			<div class="footer__left">
				<NuxtLink to="/" class="footer__logo">
					<NuxtIcon name="nav/text-logo-blue" class="footer__logo-text" filled/>
				</NuxtLink>
				<p class="footer__description">
					Мы предлагаем разнообразные варианты жилья - от уютных студий до просторных вилл. Найдите идеальное место для вашего отдыха с помощью удобного поиска. Предлагаем также экскурсии и трансферы для комфортного начала вашего путешествия.
				</p>
				<p class="footer__copyright">
					2024 © Аура Тур
				</p>
			</div>
			<div class="footer__breadcrumbs">
				<h4 class="footer__title">Карта сайта</h4>
				<div class="footer__links">
					<NuxtLink to="/" class="footer__link">Главная</NuxtLink>
					<NuxtLink to="/search" class="footer__link">Поиск</NuxtLink>
					<NuxtLink to="/favorites" class="footer__link">Избранное</NuxtLink>
					<NuxtLink to="/help" class="footer__link">Помощь</NuxtLink>
					<NuxtLink to="/contacts" class="footer__link">Контакты и реквизиты</NuxtLink>
					<NuxtLink @click="goToLK" class="footer__link">Личный кабинет</NuxtLink>
				</div>
				
			</div>
			<div class="footer__contacts">
				<NuxtLink class="contact" to="tel:/+79409976702">
					<v-icon class="contact__icon" color="#7059FF">mdi-phone-outline</v-icon>
					<div class="contact__body">
						<div class="contact__desc">Служба поддержки</div>
						<div class="contact__text">+7 (940) 997-67-02</div>
					</div>
				</NuxtLink>
				<NuxtLink class="contact">
					<v-icon class="contact__icon" color="#7059FF">mdi-map-marker-outline</v-icon>
					<div class="contact__body">
						<div class="contact__desc">Адрес</div>
						<div class="contact__text">г. Гудаута, Очамчирская 90</div>
					</div>
				</NuxtLink>
				<NuxtLink class="contact" to="https://www.instagram.com/reel/C3-uB8sIlkW/?igsh=MXE4OTM4djBqcDZsNA==">
					<v-icon class="contact__icon" color="#7059FF">mdi-instagram</v-icon>
					<div class="contact__body">
						<div class="contact__desc">Мы в Instagram</div>
						<div class="contact__text">aura_tur_abkhazia</div>
					</div>
				</NuxtLink>
			</div>
		
			
		</div>
	</div>
	<div v-else class="footer footer_mobile">
		<div class="wrapper footer__body">
			
			<NuxtLink to="/" class="footer__logo">
				<NuxtIcon name="nav/text-logo-blue" class="footer__logo-text" filled/>
			</NuxtLink>
			
			<div class="footer__contacts">
				<NuxtLink class="contact" to="tel:/+79409976702">
					<v-icon class="contact__icon" color="#7059FF">mdi-phone-outline</v-icon>
					<div class="contact__body">
						<div class="contact__desc">Служба поддержки</div>
						<div class="contact__text">+7 (940) 997-67-02</div>
					</div>
				</NuxtLink>
				<NuxtLink class="contact">
					<v-icon class="contact__icon" color="#7059FF">mdi-map-marker-outline</v-icon>
					<div class="contact__body">
						<div class="contact__desc">Адрес</div>
						<div class="contact__text">г. Гудаута, Очамчирская 90</div>
					</div>
				</NuxtLink>
				<NuxtLink class="contact" to="https://www.instagram.com/reel/C3-uB8sIlkW/?igsh=MXE4OTM4djBqcDZsNA==">
					<v-icon class="contact__icon" color="#7059FF">mdi-instagram</v-icon>
					<div class="contact__body">
						<div class="contact__desc">Мы в Instagram</div>
						<div class="contact__text">aura_tur_abkhazia</div>
					</div>
				</NuxtLink>
			</div>
			
			<div class="footer__breadcrumbs">
				<h4 class="footer__title">Карта сайта</h4>
				<div class="footer__links">
					<NuxtLink to="/" class="footer__link">Главная</NuxtLink>
					<NuxtLink to="/search" class="footer__link">Поиск</NuxtLink>
					<NuxtLink to="/favorites" class="footer__link">Избранное</NuxtLink>
					<NuxtLink to="/help" class="footer__link">Помощь</NuxtLink>
					<NuxtLink to="/contacts" class="footer__link">Контакты и реквизиты</NuxtLink>
					<NuxtLink @click="goToLK" class="footer__link">Личный кабинет</NuxtLink>
				</div>
			
			</div>
			<p class="footer__copyright">
				2024 © Аура Тур
			</p>
		</div>
	</div>
	
</template>

<style scoped lang="scss">
	//Общие стили
	.footer {
		background: #FFFFFF;
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
			font-size: 14px;
			color: $text-gray;
		}
		
		&__logo {
			margin-bottom: 16px;
		}
		
		.contact {
			display: flex;
			align-items: center;
			gap: 8px;
			margin-bottom: 16px;
			color: $text-main;
			&__desc {
				font-size: 12px;
				color: $text-gray;
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
			color: $text-main;
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