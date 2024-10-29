<script setup lang="ts">

import FilterForm from "~/modules/Search/components/filters/FilterForm.vue";
import useFilters from "~/modules/Search/composables/useFilters";
import useCatalog from "~/modules/Search/composables/useCatalog";
const {filtersModalIsOpen} = useFilters();
const {listingsList} = useCatalog()
const {isMobile} = useDevice();
</script>

<template>
	<v-dialog v-model="filtersModalIsOpen" max-width="600" :fullscreen="isMobile">
		<v-card>
			<v-toolbar>
				<v-btn
					icon="mdi-close"
					@click="filtersModalIsOpen = false"
				></v-btn>
				
				<v-toolbar-title>Фильтры</v-toolbar-title>
				
				<v-spacer></v-spacer>
				
				<v-toolbar-items>
					<v-btn
						text="Сбросить"
						variant="text"
						@click="filtersModalIsOpen = false"
					></v-btn>
				</v-toolbar-items>
			</v-toolbar>
			<v-card-item class="filters-modal">
				<FilterForm class="mb-12"/>
			</v-card-item>
			<div class="fixed-btn">
				<v-btn width="100%"  color="#7059FF" @click="filtersModalIsOpen = false">Показать {{listingsList.count}} вариантов</v-btn>
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