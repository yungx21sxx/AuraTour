<script setup lang="ts">

	definePageMeta({
		layout: 'admin',
		middleware: ['admin-only']
	})
	import { ref } from 'vue'
	
	async function fetchListings ({ page, itemsPerPage, sortBy }) {
		console.log(sortBy)
		const response = await $fetch(`/api/statistics/listings`, {
			method: 'POST',
			body: {
				sortBy: sortBy.length > 0 ? sortBy[0].key : 'revenue',
				page,
				itemsPerPage,
				sortOrder: sortBy.length > 0 ? sortBy[0].order : 'desc'
			}
		})
		return {items: response.data, total: response.pagination.totalItems}
	}
	const itemsPerPage = ref(5)
	const headers = ref([
		{
			title: 'id',
			align: 'start',
			sortable: true,
			key: 'id',
		},
		{ title: 'Название', sortable: false, key: 'title', align: 'end' },
		{ title: 'Прибыль', key: 'revenue', align: 'end' },
		{ title: 'Просмотры', key: 'views', align: 'end' },
		{ title: 'Заявки', key: 'submits', align: 'end' },
		{ title: 'Брони', key: 'bookings', align: 'end' },
		{ title: 'В избранных', key: 'favorites', align: 'end' },
	])
	const search = ref('')
	const serverItems = ref([])
	const loading = ref(true)
	const totalItems = ref(0)
	function loadItems ({ page, itemsPerPage, sortBy }) {
		loading.value = true
		fetchListings({ page, itemsPerPage, sortBy }).then(({ items, total }) => {
			serverItems.value = items
			totalItems.value = total
			loading.value = false
		})
	}
	const selectedListings = ref([]);
	
	const onSelect = async (id: number) => {
		await navigateTo(`/listing/${id}`, {
			open: {
				target: '_blank'
			}
		})
	}

</script>

<template>
	<h1>Статистика</h1>
	<v-data-table-server
		class="mt-8"
		v-model:items-per-page="itemsPerPage"
		v-model="selectedListings"
		select-strategy="single"
		show-select
		@update:modelValue="onSelect"
		:headers="headers"
		:items="serverItems"
		:items-length="totalItems"
		:loading="loading"
		:search="search"
		item-value="id"
		@update:options="loadItems"
	></v-data-table-server>
</template>

<style scoped lang="scss">

</style>