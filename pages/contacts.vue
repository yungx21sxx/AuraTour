<script setup lang="ts">

import {mdiInstagram, mdiMapMarkerOutline, mdiPhoneOutline} from "@mdi/js";
import MenuMain from "~/modules/Menu/components/MenuMain.vue";
import CallBackForm from "~/modules/Common/CallBackForm.vue";
import PassListingBanner from "~/modules/Pages/MainPage/PassListingBanner.vue";

useSeoMeta({
	title: 'Контакты и реквизиты — свяжитесь с нами для бронирования жилья в Абхазии',
	description: 'Контактная информация и реквизиты. Наши телефоны, электронная почта и адрес для связи. Мы поможем с бронированием жилья, трансферами и ответим на все ваши вопросы. Работаем 24/7!'
})
</script>

<template>
	<MenuMain/>
	<div class="wrapper contacts-page mt-8">
		
		<CallBackForm/>
		<div class="map">
			<iframe
				class="map__frame"
				src="https://yandex.ru/map-widget/v1/?ll=40.616670%2C43.102695&mode=search&oid=181680253232&ol=biz&sctx=ZAAAAAgBEAAaKAoSCY9WtaSjUD5AEQgB%2BRIq%2BE1AEhIJ8bkT7L%2FO9j8Rfa8hOC7j2T8iBgABAgMEBSgKOABAAkgBagJydZ0BzcxMPaABAKgBAL0BsYfa28IBBrDS8uekBYICHtCw0YPRgNCwINGC0YPRgCDQsNCx0YXQsNC30LjRj4oCAJICBTI5Mzg2mgIMZGVza3RvcC1tYXBz&sll=40.616670%2C43.102695&sspn=0.015004%2C0.006217&text=%D0%B0%D1%83%D1%80%D0%B0%20%D1%82%D1%83%D1%80%20%D0%B0%D0%B1%D1%85%D0%B0%D0%B7%D0%B8%D1%8F&z=17.57"
				style="position:relative; width: 100%; height: 100%;"
			></iframe>
		</div>
	
		<PassListingBanner class="pass-listing mt-8"/>
		
		<h2 class="mt-8">Реквизиты</h2>
		<div class="bank mt-4">
			<p><strong>Получатель:</strong> Капш Лаура Вахтанговна</p>
			<p><strong>Номер счета:</strong> 40820810130064178704</p>
			<p><strong>Банк получателя:</strong> ЮГО-ЗАПАДНЫЙ БАНК ПАО СБЕРБАНК</p>
			<p><strong>БИК:</strong> 046015602</p>
			<p><strong>Корр. счет:</strong> 30101810600000000602</p>
			<p><strong>ИНН:</strong> 7707083893</p>
			<p><strong>КПП:</strong> 236643001</p>
			<p><strong>SWIFT-код:</strong> SABRRUMM</p>
			
		</div>
	</div>

</template>

<style scoped lang="scss">
.contacts-page {
	
	margin-top: 32px;
	.contacts {
		margin-top: 16px;
	}
	
	.map {
		width: 100%;
		height: 500px;
		
		&__frame {
			border-radius: 10px;
			border: none;
		}
	}
	
}

.bank p {
	margin-top: 8px;
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

</style>