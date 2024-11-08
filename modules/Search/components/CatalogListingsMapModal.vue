<script setup lang="ts">

import CatalogListingsMap from "~/modules/Search/components/CatalogListingsMap.vue";
import {mdiClose, mdiTuneVariant} from "@mdi/js";
import BtnPrimary from "~/modules/Common/UI/BtnPrimary.vue";
import useFilters from "~/modules/Search/composables/useFilters";
import useMapCatalog from "~/modules/Search/composables/useMapCatalog";
import BtnSecondary from "~/modules/Common/UI/BtnSecondary.vue";
const {filtersModalIsOpen } = useFilters();
const {mapModalIsOpen} = useMapCatalog()
</script>

<template>
	<v-dialog fullscreen v-model="mapModalIsOpen">
		<div class="header">
			<BtnPrimary class="btn-filter"  color="#7059FF"  :prepend-icon="mdiTuneVariant" @click="filtersModalIsOpen = true">Фильтры жилья</BtnPrimary>
			<BtnSecondary :prepend-icon="mdiClose" color="#fff" @click="mapModalIsOpen = false">Закрыть</BtnSecondary>
		</div>
		<CatalogListingsMap :key="2" target="modal"/>
	</v-dialog>
</template>

<style scoped lang="scss">

	.header {
		position: absolute;
		z-index: 1000;
		padding: 10px;
		display: flex;
		width: 100%;
		gap: 16px;
		.btn-filter {
			flex: 1;
		}
	}

</style>