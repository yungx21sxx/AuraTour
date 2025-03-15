<script setup lang="ts">

import FilterForm from "~/modules/Search/components/filters/FilterForm.vue";
import useFilters from "~/modules/Search/composables/useFilters";
import useCatalog from "~/modules/Search/composables/useCatalog";
import {mdiClose} from "@mdi/js";
import {numberToVariantsString} from "../../../../utils/utils";
const {filtersModalIsOpen, resetFilters, performNavigation} = useFilters();
const {isFiltering, listingsList} = useCatalog()
const {isMobile} = useDevice();

const onFiltersSave = async () => {
	filtersModalIsOpen.value = false;
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
				<FilterForm class="mb-12"/>
			</v-card-item>
			<div class="fixed-btn">
				<v-btn
					width="100%"
					color="#7059FF"
					@click="onFiltersSave"
					:loading="isFiltering"
				>
					{{ listingsList.count > 0 ? `Показать ${numberToVariantsString(listingsList.count)}` : 'Жилье не найдено' }}
				</v-btn>
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