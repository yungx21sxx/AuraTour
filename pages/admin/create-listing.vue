<script setup lang="ts">
import ListingCreateForm from "~/modules/Admin/ListingCRUD/components/ListingCreateForm.vue";

definePageMeta({
	layout: 'admin',
	middleware: ['admin-only'],
})

</script>

<template>
	<client-only>
		<ListingCreateForm/>
	</client-only>
</template>

<style scoped lang="scss">



.form__flex {
	display: flex;
	gap: 16px;
	@media screen and (max-width: 500px) {
		flex-direction: column;
	}
}




</style>