<script setup lang="ts">
import type { MenuVariants } from "~/modules/Menu/types/menu.types";

const { variant = 'dark' } = defineProps<{
	variant?: MenuVariants;
}>();


</script>

<template>
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="36"
        height="36"
        viewBox="0 0 20 20"
    >
        <path
            :fill="variant === 'dark' ? '#333D46' : 'white'"
            fill-rule="evenodd"
            d="M3 5a1 1 0 0 1 1-1h12a1 1 0 1 1 0 2H4a1 1 0 0 1-1-1m0 5a1 1 0 0 1 1-1h12a1 1 0 1 1 0 2H4a1 1 0 0 1-1-1m6 5a1 1 0 0 1 1-1h6a1 1 0 1 1 0 2h-6a1 1 0 0 1-1-1"
            clip-rule="evenodd"
        />
    </svg>
</template>

<style scoped lang="scss">
svg {
    height: 24px;
}
</style>
