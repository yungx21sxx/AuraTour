<script setup lang="ts">

import ListingCreateForm from "~/modules/Admin/ListingCRUD/components/ListingCreateForm.vue";

definePageMeta({
	layout: 'lk',
	middleware: ['auth-user-only']
})


</script>

<template>
	<client-only>
		<ListingCreateForm/>
	</client-only>
</template>

<style scoped lang="scss">

</style>