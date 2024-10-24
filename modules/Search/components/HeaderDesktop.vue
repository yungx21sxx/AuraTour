<script setup lang="ts">
import FilterFormBookingInfo from "~/modules/Search/components/filters/FilterFormBookingInfo.vue";

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
		<div class="wrapper">
			<v-breadcrumbs :items="breadcrumbs" class="header__breadcrumbs"/>
			<FilterFormBookingInfo/>
		</div>
		
	</div>
	
</template>

<style scoped lang="scss">
	.header {
		background: $bg-card;
		border-top: 1px solid $bg;
		padding-top: 16px;
		padding-bottom: 16px;
	
		
		&__breadcrumbs {
			margin-bottom: 16px;
		}
	}

</style>