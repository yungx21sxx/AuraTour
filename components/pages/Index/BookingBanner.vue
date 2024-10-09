<script setup lang="ts">

	import BookingMainForm from "~/components/Booking/BookingMainForm.vue";
</script>

<template>
	<v-img
		src="/main-page/banner-desktop1.webp"
		
		class="banner"
		alt="Аура Тур"
		gradient="to bottom, rgba(0,0,0,.3), rgba(0,0,0,.1)"
		cover
	>
		<template #sources>
			<source media="(max-width: 750px)" srcset="/main-page/banner-mobile1.webp">
			<!-- Для ПК -->
			<source media="(min-width: 751px)" srcset="/main-page/banner-desktop1.webp">
		
		
		</template>
		<div class="banner__body">
			<div class="banner__wrapper wrapper">
				<v-chip class="banner__chip" prepend-icon="mdi-key-chain" size="large" color="#F2A30F" variant="flat">Жилье посуточно</v-chip>
				<h1 class="banner__title">
					Добро пожаловать в <br> <span>Абхазию</span>
				</h1>
				<p class="banner__info">
					Отпуск как дома
				</p>
				<BookingMainForm/>
			</div>
			
		
		</div>
	</v-img>
</template>

<style lang="scss" scoped>
	.banner {
		
		@media screen and (max-width: 750px) {
			height: calc(100svh - $nav-mobile-height)  !important;
		}
		@media screen and (max-width: 430px) {
			&__title {
				font-size: 32px !important;
				line-height: 50px !important;
				span {
					font-size: 34px !important;
				}
				br {
					display: none;
				}
			}
			
			&__info {
				font-size: 20px !important;
			}
		}
		
		@media screen and (max-width: 340px) {
			&__title {
				font-size: 28px !important;
			}
			&__chip {
				height: 30px !important;
			}
		}
		
		
		height: 650px;
		
		&__chip {
			color: #FFFFFF !important;
			height: 32px !important;
			margin-bottom: 8px;
		}
	
		&__body {
			//background: rgba(0, 0, 0, 0.3);
			height: 100%;
		}
		
		&__title {
			font-size: 42px;
			color: #FFFFFF;
			line-height: 60px;
			
			span {
				color: $accent-orange;
				font-size: 46px;
			}
		}
		
		&__bottom {
			position: absolute;
			bottom: 0;
			left: 0;
			right: 0;
			display: flex;
			justify-content: center;
		}
		&__info {
			color: #FFFFFF;
			margin-top: 6px;
			font-size: 20px;
			margin-bottom: 24px;
			line-height: 170%;
			border-left: 3px solid $accent-orange;
			padding-left: 8px;
		}
		&__body {
			
			
			height: 100%;
			display: flex;
			flex-direction: column;
			justify-content: center;
			
		}
		
	
		
	}


</style>