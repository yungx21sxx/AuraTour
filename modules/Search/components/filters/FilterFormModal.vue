<script setup lang="ts">

import FilterForm from "~/modules/Search/components/filters/FilterForm.vue";
import useFilters from "~/modules/Search/composables/useFilters";
import useCatalog from "~/modules/Search/composables/useCatalog";
import {mdiClose} from "@mdi/js";
const {filtersModalIsOpen, resetFilters, performNavigation} = useFilters();
const {isMobile} = useDevice();

const onFiltersSave = async () => {
	filtersModalIsOpen.value = false;
	await performNavigation();
}
</script>

<template>
	<v-dialog v-model="filtersModalIsOpen" max-width="600" :fullscreen="isMobile">
		<v-card>
			<v-toolbar>
				<v-btn
					:icon="mdiClose"
					@click="filtersModalIsOpen = false"
				></v-btn>
				
				<v-toolbar-title>Фильтры</v-toolbar-title>
				
				<v-spacer></v-spacer>
				
				<v-toolbar-items>
					<v-btn
						text="Сбросить"
						variant="text"
						@click="resetFilters"
					></v-btn>
				</v-toolbar-items>
			</v-toolbar>
			<v-card-item class="filters-modal">
				<FilterForm class="mb-12" target="modal"/>
			</v-card-item>
			<div class="fixed-btn">
				<v-btn width="100%"  color="#7059FF" @click="onFiltersSave">Сохранить</v-btn>
			</div>
		</v-card>
	</v-dialog>
</template>

<style scoped lang="scss">
	.fixed-btn {
		position: fixed;
		bottom: 0;
		width: 100%;
		padding: 16px;
	}

</style>