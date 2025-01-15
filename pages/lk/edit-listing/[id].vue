<script setup lang="ts">

import ListingUpdateForm from "~/modules/Admin/ListingCRUD/components/ListingUpdateForm.vue";

definePageMeta({
	layout: 'lk',
	middleware: ['auth-user-only']
})

</script>

<template>
	<client-only>
		<ListingUpdateForm/>
	</client-only>
</template>

<style scoped lang="scss">

</style>