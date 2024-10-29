<script setup lang="ts">
import FilterFormBookingInfo from "~/modules/Search/components/filters/FilterFormBookingInfo.vue";
import MenuMain from "~/modules/Menu/components/MenuMain.vue";

const breadcrumbs = [
	{
		title: 'Главная',
		disabled: false,
		href: '/',
	},
	{
		title: 'Выбрать жилье',
		disabled: true,
		href: '',
	},
];

</script>

<template>
	<div class="header">
		<MenuMain/>
		<div class="wrapper header__body">
			<v-breadcrumbs :items="breadcrumbs" class="header__breadcrumbs"/>
			<FilterFormBookingInfo/>
		</div>
		
	</div>
	
</template>

<style scoped lang="scss">
	.header {
		background: $bg-card;
		border-top: 1px solid $bg;
	
		
		&__breadcrumbs {
			margin-bottom: 16px;
		}
		
		&__body {
			margin-top: 24px;
		}
	}

</style>