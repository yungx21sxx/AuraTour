<script setup lang="ts">

	import type {IFilterProperty} from "~/types/response.types";
	import useShowListingCount from "~/composables/useShowListingCount";
	const showListingCount = useShowListingCount()
	
	const modelValue = defineModel<number[]>();
	
	const {show} = withDefaults(defineProps<{
		title: string,
		variants: IFilterProperty[] | null,
		show?: boolean,
	}>(), {
		show: true
	});
	
	const showTypes = ref(show);
	

</script>

<template>
	<div class="filter">
		<div class="filter__title filter__title_checkbox">
			<span>{{title}}</span>
			<v-btn
				:icon="showTypes ? 'mdi-chevron-up' : 'mdi-chevron-down'"
				@click="showTypes = !showTypes"
				variant="text"
			></v-btn>
		</div>
		<v-expand-transition>
			<div v-show="showTypes">
				<v-checkbox
					hide-details
					v-for="{count, id, name} of variants"
					:value="id"
					v-model="modelValue"
					color="#7059FF"
					:disabled="count === 0"
					class="checkbox"
				>
					<template #label>
						<span class="filter__label">{{name}}</span>
					</template>
					<template #append v-if="showListingCount">{{count}}</template>
				</v-checkbox>
			</div>
		</v-expand-transition>
	</div>
</template>

<style scoped lang="scss">
.filter {
	margin-bottom: 8px;
	
	&__label {
		font-size: 14px;
		font-weight: 600;
	}
	
	&__title {
		font-weight: 600;
		display: block;
		
		&_checkbox {
			margin-bottom: -8px !important;
			display: flex;
			justify-content: space-between;
			align-items: center;
			
			button {
				margin-right: -16px;
			}
		}
	}
}

.checkbox {
	margin-left: -8px;
	margin-bottom: -8px;
}


</style>