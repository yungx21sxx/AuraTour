<template>
	<v-app>
		<MenuFixed/>
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
	import MenuFixed from "~/modules/Menu/components/MenuFixed.vue";
	
	const { isMobileOrTablet } = useDevice()
	
</script>