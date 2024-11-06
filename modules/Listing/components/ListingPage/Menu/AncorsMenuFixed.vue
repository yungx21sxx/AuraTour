<script setup lang="ts">

import AncorsMenu from "~/modules/Listing/components/ListingPage/Menu/AncorsMenu.vue";
const isMenuVisible = ref(false);
let lastScrollY = 0;


const handleScroll = () => {
	const currentScrollY = window.scrollY;
	
	// Показываем меню, если скроллим вниз и скрываем только при старте страницы
	if (currentScrollY > lastScrollY && currentScrollY > 300) {
		isMenuVisible.value = true;
	} else if (currentScrollY < 100) {
		isMenuVisible.value = false;
	}
	
	lastScrollY = currentScrollY;
};

onMounted(() => {
	window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
	window.removeEventListener('scroll', handleScroll);
});

</script>

<template>
	<transition name="slide-fade">
		<div v-if="isMenuVisible" class="header-wrapper">
			<div class="wrapper">
				<AncorsMenu/>
			</div>
		
		</div>
	</transition>
	
</template>

<style scoped lang="scss">

.header-wrapper {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	background-color: white;
	box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
	z-index: 1000;
	transition: transform 0.3s ease-in-out;
}

.slide-fade-enter-active,
.slide-fade-leave-active {
	transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
	transform: translateY(-100%);
	opacity: 0;
}

.slide-fade-enter-to {
	transform: translateY(0);
	opacity: 1;
}

</style>