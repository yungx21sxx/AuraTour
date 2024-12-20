<script setup lang="ts">

	import BtnPrimary from "~/modules/Common/UI/BtnPrimary.vue";
	import {mdiMagnify} from "@mdi/js";
	import type {H3Error} from "h3";
	import {ref} from "vue";
	
	definePageMeta({
		layout: 'admin',
		middleware: ['admin-only'],
	})
	
	const listingId = ref<null | number>(null);
	const formRef = ref();
	
	const sendRedirect = async () => {
		if (formRef.value) {
			const { valid } = await formRef.value.validate();
			if (!valid) {
				return;
			}
		} else {
			console.error('Form ref is not defined');
			return;
		}
		try {
			const { href } = await $fetch(`/api/listing/${listingId.value}/redirect`);
			await navigateTo(href, {
				open: {
					target: '_blank'
				}
			})
		} catch (e: H3Error) {
			alert(e.data.message)
		}

	}
	
</script>

<template>
	<h2 class="pa-4">Поиск объектов по ID</h2>
	<v-form ref="formRef" class="d-flex mt-2 ga-4 pl-4 pr-4" @submit.prevent="sendRedirect">
		<v-text-field type="number" :rules="[(v: string) => !!v || 'Введите номер',]" variant="outlined" required v-model.number="listingId" label="Номер объекта"/>
		<BtnPrimary :prepend-icon="mdiMagnify" type="submit" height="56px">Найти</BtnPrimary>
	</v-form>
</template>

<style scoped lang="scss">

</style>