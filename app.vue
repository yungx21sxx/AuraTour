<template>
	<NuxtLoadingIndicator color="#7059FF"/>
	<NuxtLayout>
		<NuxtPage/>
		<AuthModal/>
		<BurgerMenuModal/>
		<LandLordInfoModal/>
	</NuxtLayout>
</template>


<style lang="scss">
    @import "/assets/scss/main";
    @import "/assets/scss/icons";
</style>
<script setup lang="ts">
	import 'v-calendar/style.css';
	import AuthModal from "~/modules/Auth/components/AuthModal.vue";
	import BurgerMenuModal from "~/modules/Menu/components/BurgerMenuModal.vue";
	import useSearch from "~/modules/Booking/composables/useSearch";
	import LandLordInfoModal from "~/modules/Common/LandLordInfoModal.vue";
	const {loadSearchData} = useSearch()
	await loadSearchData();
</script>