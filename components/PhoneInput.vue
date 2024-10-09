<template>
	<v-text-field
		v-model="phoneInput"
		
		label="Номер телефона"
		variant="outlined"
		prefix="+7"
		ref="inputNode"
	>
	</v-text-field>
</template>

<script setup lang="ts">
import { Mask } from "maska";

const mask = new Mask({ mask: "(###) ###-##-##" });
const inputNode = ref(null);

const modelValue = defineModel<string>();
const emit = defineEmits<{
	(e: 'update-row-value', value: string): string
}>();

function extractNumbersFromString(str: string): string {
	if (typeof str === "string") {
		const numbers = str.match(/\d+/g);
		if (numbers) {
			return parseInt(numbers.join(''), 10).toString();
		}
	}
	return ''
}



onMounted(() => {
	//@ts-ignore
	inputNode.value.addEventListener('input', (event) => {
		event.target.value = mask.masked(event.target.value)
	})
})

const phoneInput = computed<string>({
	//@ts-ignore
	get() {
		return modelValue.value
	},
	set(value) {
		modelValue.value = value
		emit('update-row-value', extractNumbersFromString(value))
	}
})

</script>

<style lang="scss" scoped>
input {
	color: #CC9933;
	background: #fff;
}
</style>