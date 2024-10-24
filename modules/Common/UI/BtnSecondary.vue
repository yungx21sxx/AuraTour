<script setup lang="ts">

</script>

<template>
	<v-btn :elevation="0" class="btn-secondary" color="#F1F3F9" :ripple="{
		class: 'text-white'
	}"><slot/></v-btn>
</template>

<style lang="scss">
	.btn-secondary {
		border-radius: 8px !important;
		color: $accent-blue !important;
		caret-color: $accent-blue !important;
	}
</style>