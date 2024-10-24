<script setup>
	import ListingsSlider from "~/modules/Listing/components/shared/ListingsSlider.vue";
	
	const {data: housingTypes, pending} = await useFetch('/api/listings/all-types', {
		transform: housingTypes => housingTypes.filter(type => type.totalCount > 0)
	});
	const currentType = ref();

	async function goToCategory() {
		await navigateTo({
			path: '/search',
			query: {
				housingTypesId: [currentType.value]
			}
		})
	}
</script>

<template>
	<div class="wrapper types">
		<h2 class="types__title">Лучшие предложения</h2>
		<VNoSsr>
			<div class="types__catalog">
				<v-tabs show-arrows center-active v-model="currentType" class="mt-4 mb-4 types__tabs">
					<v-tab v-for="housingType of housingTypes"
					       :value="housingType.id"
					       color="#7059FF"
					>{{housingType.name}}</v-tab>
				</v-tabs>
				<v-window v-model="currentType" :touch="false" disabled>
					<v-window-item  v-for="housingType of housingTypes" :value="housingType.id">
						<div class="types__list" style="height: 425px">
							<v-lazy>
								<ListingsSlider :listings="housingType.listings">
									<template #action>
										<v-btn @click="goToCategory" class="types__btn" color="#7059FF" elevation="0">Смотреть {{numberToVariantsString(housingType.totalCount)}}</v-btn>
									</template>
								</ListingsSlider>
							</v-lazy>
						</div>
						
						
					</v-window-item>
				</v-window>
			</div>
		</VNoSsr>
		
	</div>
	
</template>

<style scoped lang="scss">

	.types {
		&__title {
			font-size: 32px;
			margin-top: 32px;
			
			text-align: center;
		}
		
		&__tabs {
			@media screen and (max-width: 800px){
				margin-left: -16px;
				margin-right: -16px;
			}
			
			margin-bottom: 16px !important;
		}
		
		@media screen and (max-width: 450px) {
			&__title {
				font-size: 24px;
				text-align: center;
			}
			
			&__btn {
				width: 100%;
			}
		}
	}

</style>