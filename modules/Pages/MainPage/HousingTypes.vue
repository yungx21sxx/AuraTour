<script setup>
	import ListingsSlider from "~/modules/Listing/components/shared/ListingsSlider.vue";
	import BtnPrimary from "~/modules/Common/UI/BtnPrimary.vue";
	
	const housingTypes = await $fetch('/api/listings/all-types', {
		transform: housingTypes => housingTypes.filter(type => type.totalCount > 0)
	});
	const currentType = ref();

	async function goToCategory() {
		await navigateTo({
			path: '/search',
			query: {
				housingTypesId: [currentType.value]
			},
		}, {external: true})
	}
</script>

<template>
	<div class="types">
		<div class="types__catalog">
			<v-tabs show-arrows center-active v-model="currentType" class="mt-4 mb-4 types__tabs">
				<v-tab v-for="housingType of housingTypes"
				       :value="housingType.id"
				       color="#7059FF"
				>{{housingType.name}}</v-tab>
			</v-tabs>
			<v-window v-model="currentType" :touch="false" disabled>
				<v-window-item :eager="true"  v-for="housingType of housingTypes" :value="housingType.id">
					<div class="types__list" style="height: 425px; margin-top: 16px;">
						<ListingsSlider :listings="housingType.listings" :key="housingType.id">
							<template #action>
								<BtnPrimary @click="goToCategory" class="types__btn" color="#7059FF" elevation="0">Смотреть {{numberToVariantsString(housingType.totalCount)}}</BtnPrimary>
							</template>
						</ListingsSlider>
					</div>
				</v-window-item>
			</v-window>
		</div>
	</div>
	
</template>

<style scoped lang="scss">

	.types {
		&__title {
			font-size: 32px;
			margin-top: 42px;
			text-align: center;
		}
		
		&__tabs {
			@media screen and (max-width: 800px){
				margin-left: -16px;
				margin-right: -16px;
			}
			
			margin-bottom: 16px !important;
		}
		
		@media screen and (max-width: 650px) {
			&__title {
				font-size: 24px;
				
			}
			
			&__btn {
				width: 100% !important;
			}
		}
	}

</style>