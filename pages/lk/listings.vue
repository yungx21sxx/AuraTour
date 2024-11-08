<script setup lang="ts">
import {useAuthUser} from "~/modules/Auth/composables/useAuthUser";
import ListingItemCatalog from "~/modules/Listing/components/shared/ListingItemCatalog.vue";
import BtnPrimary from "~/modules/Common/UI/BtnPrimary.vue";

definePageMeta({
	layout: 'lk',
	middleware: ['auth-user-only']
})
const authUser = useAuthUser();

const {data: listings, refresh} = await useAsyncData('user-listings', () => $fetch(`/api/users/${authUser.value?.id}/listings`));

</script>

<template>
	<h2 class="title mb-4">
		Мои объекты
	</h2>
	<v-alert v-if="listings.length === 0" class="mb-4" type="info" title="У вас пока нет объектов"></v-alert>
	<BtnPrimary class="mb-4" href="/lk/create-listing">Загрузить объект</BtnPrimary>
	<ListingItemCatalog
		target="lk"
		v-for="listing of listings"
		:listing="listing"
	/>
</template>

<style scoped lang="scss">

</style>