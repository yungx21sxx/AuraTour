<template>
	<NuxtLoadingIndicator color="#7059FF"/>
	<NuxtLayout>
		<NuxtPage/>
		<AuthModal/>
		<BurgerMenuModal/>
	</NuxtLayout>
</template>


<style lang="scss">
	@use "/assets/scss/settings";
    @import "/assets/scss/main";
    @import "/assets/scss/icons";
</style>
<script setup lang="ts">
import AuthModal from "~/modules/Auth/components/AuthModal.vue";
import BurgerMenuModal from "~/modules/Menu/components/BurgerMenuModal.vue";
import useSearch from "~/modules/Booking/composables/useSearch";
const {loadSearchData} = useSearch()
await loadSearchData();
</script>