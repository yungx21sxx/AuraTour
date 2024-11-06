<script setup lang="ts">

import BonusIcon from "~/modules/Pages/MainPage/Icons/BonusIcon.vue";
import {mdiChevronRight} from "@mdi/js";
import TransferIcon from "~/modules/Pages/MainPage/Icons/TransferIcon.vue";
import useAuthModal from "~/modules/Auth/composables/useAuthModal";

const {openAuthModal} = useAuthModal()
</script>

<template>
	<div class="wrapper promo-wrapper">
		<section class="promo">
			<BonusIcon class="bonus-icon"/>
			<h3>Вернем до 10% от суммы бронирования</h3>
			<p>После завершения бронирования на ваш аккаунт будут начислены бонусы, которыми можно оплать следующее заселение.</p>
			<button>
				<span>Подробнее</span>
				<v-icon :icon="mdiChevronRight"/>
			</button>
		</section>
		<section class="promo">
			<TransferIcon/>
			<h3>Бесплатная экскурсия</h3>
			<p>При бронирование жилья на срок от 10 дней, экскурсия в подарок</p>
			<button>
				<span>Смотреть жилье</span>
				<v-icon :icon="mdiChevronRight"/>
			</button>
		</section>
	</div>
</template>

<style scoped lang="scss">

	.promo-wrapper{
		display: grid;
		margin-top: 42px;
		grid-template-columns: 1fr 1fr;
		gap: 24px;
	}

	.promo {
		background: linear-gradient(to bottom, #7059FF, #7E04A9);
		border-radius: 16px;
		padding: 20px;
		color: #fff;
		
		h3 {
			font-size: 20px;
			margin-bottom: 8px;
		}
		p {
			color: #EAEAEA;
			margin-bottom: 16px;
			font-size: 14px;
		}
		svg {
			height: 32px;
			margin-bottom: 8px;
		}
		.bonus-icon {
			height: 34px;
			width: auto;
			
		}
	}
	
	@media screen and (max-width: 910px) {
		.promo-wrapper {
			grid-template-columns: 1fr;
		}
	}

</style>