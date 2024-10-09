<template>
	<v-app>
		<MenuMobile v-if="isMobileOrTablet"/>
		<MenuDesktop v-else/>
		<div class="main">
			<slot/>
		</div>
		<CFooter/>
	</v-app>
</template>


<style lang="scss">
.main {
	min-height: calc(100svh - $nav-mobile-height - 270px);
}
</style>
<script setup lang="ts">
	
	import MenuMobile from "~/components/Menu/MenuMobile.vue";
	import MenuDesktop from "~/components/Menu/MenuDesktop.vue";
	
	const { isMobileOrTablet } = useDevice()
	
</script>