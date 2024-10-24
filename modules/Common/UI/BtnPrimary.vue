<script setup lang="ts">

</script>

<template>
	<v-btn color="#7059FF" class="btn-primary" :elevation="0">
		<slot/>
	</v-btn>
</template>

<style lang="scss">
	.btn-primary {
		border-radius: 8px !important;
	}

</style>