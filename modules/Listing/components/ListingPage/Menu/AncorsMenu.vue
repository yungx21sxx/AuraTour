<script setup lang="ts">

import {mdiHeartOutline, mdiShareVariant} from "@mdi/js";
import ListingAncors from "~/modules/Listing/components/ListingPage/ListingAncors.vue";

const {isMobile} = useDevice()
</script>

<template>
	<div class="nav">
		<ListingAncors/>
		<div class="nav__actions" v-if="!isMobile">
			<v-btn variant="text" :prepend-icon="mdiHeartOutline">Сохранить</v-btn>
			<v-menu>
				<template v-slot:activator="{ props }">
					<v-btn v-bind="props" variant="text" :prepend-icon="mdiShareVariant">Поделиться</v-btn>
				</template>
				<v-list>
					<v-list-item>
						<v-btn>Скопировать ссылку</v-btn>
					</v-list-item>
				</v-list>
			</v-menu>
		</div>
	</div>
</template>

<style scoped lang="scss">

.nav {
	display: flex;
	justify-content: space-between;
	&__actions {
		display: flex;
		align-items: center;
	}
}

</style>