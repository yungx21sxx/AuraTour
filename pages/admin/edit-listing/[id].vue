<script setup lang="ts">
import ListingUpdateForm from "~/modules/Admin/ListingCRUD/components/ListingUpdateForm.vue";

definePageMeta({
	layout: 'admin',
	middleware: ['admin-only'],
})

</script>

<template>
	<client-only>
		<ListingUpdateForm/>
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