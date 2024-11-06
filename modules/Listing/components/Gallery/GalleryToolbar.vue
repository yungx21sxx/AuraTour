<script setup lang="ts">
import {mdiChevronLeft, mdiHeartOutline, mdiShareVariant} from "@mdi/js";
const {isMobile} = useDevice()
const emits = defineEmits(['onClose'])
</script>

<template>
	<v-toolbar color="#fff" density="comfortable">
		<template #prepend>
			<v-btn :prepend-icon="mdiChevronLeft" @click="emits('onClose')">Назад</v-btn>
		</template>
		<template #append>
			<v-btn v-if="isMobile" :icon="mdiHeartOutline"/>
			<v-btn v-else variant="text" :prepend-icon="mdiHeartOutline">Сохранить</v-btn>
			<v-menu>
				<template v-slot:activator="{ props }">
					<v-btn v-if="isMobile" :icon="mdiShareVariant"/>
					<v-btn v-else v-bind="props" variant="text" :prepend-icon="mdiShareVariant">Поделиться</v-btn>
				</template>
				<v-list>
					<v-list-item>
						<v-btn>Скопировать ссылку</v-btn>
					</v-list-item>
				</v-list>
			</v-menu>
		</template>
	</v-toolbar>

</template>

<style scoped lang="scss">

</style>