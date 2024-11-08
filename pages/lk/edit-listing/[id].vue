<script setup lang="ts">

import ListingUpdateForm from "~/modules/Admin/ListingCRUD/components/ListingUpdateForm.vue";

definePageMeta({
	layout: 'lk',
	middleware: ['auth-user-only']
})

</script>

<template>
	<ListingUpdateForm/>

</template>

<style scoped lang="scss">

</style>