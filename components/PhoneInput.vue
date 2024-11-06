<template>
	<v-text-field
		v-model="displayPhoneNumber"
		label="Введите номер телефона"
		:placeholder="placeholder"
		@input="onInput"
	></v-text-field>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
	modelValue: {
		type: String,
		default: '',
	},
});

const emit = defineEmits(['update:modelValue']);

// Placeholder для поля ввода
const placeholder = '+7 (___) ___-__-__';

// Хранит номер телефона вместе со знаком '+'
const rawPhoneNumber = ref(props.modelValue);

// Вычисляемое свойство для отображения форматированного номера
const displayPhoneNumber = computed({
	get() {
		return formatPhoneNumber(rawPhoneNumber.value);
	},
	set(value) {
		rawPhoneNumber.value = unformatPhoneNumber(value);
	},
});

// Наблюдаем за изменениями в modelValue и обновляем rawPhoneNumber
watch(
	() => props.modelValue,
	(newVal) => {
		rawPhoneNumber.value = newVal;
	}
);

// Наблюдаем за изменениями в rawPhoneNumber и эмитим обновлённое значение
watch(rawPhoneNumber, (newVal) => {
	emit('update:modelValue', newVal);
});

// Функция для обработки ввода пользователя
function onInput(event) {
	let input = event.target.value;
	
	// Удаляем все нецифровые символы, кроме '+'
	input = input.replace(/[^\d+]/g, '');
	
	// Заменяем ведущую '8' на '+7'
	if (input.startsWith('8')) {
		input = '+7' + input.slice(1);
	}
	
	// Если '+' не в начале, перемещаем его в начало
	if (input.includes('+') && !input.startsWith('+')) {
		input = '+' + input.replace(/\+/g, '');
	}
	
	// Если номер не начинается с '+7', заменяем на '+7'
	if (!input.startsWith('+7')) {
		input = '+7' + input.replace(/^\+?/, '');
	}
	
	// Ограничиваем длину до 12 символов (например, '+7XXXXXXXXXX')
	input = input.slice(0, 12);
	
	rawPhoneNumber.value = input;
}

// Функция для форматирования номера телефона для отображения
function formatPhoneNumber(value) {
	if (!value) {
		return '';
	}
	
	// Удаляем все нецифровые символы, кроме '+'
	const digits = value.replace(/[^\d+]/g, '');
	
	let formatted = digits;
	
	// Форматируем по шаблону "+7 (xxx) xxx-xx-xx"
	if (digits.startsWith('+7')) {
		const numbers = digits.slice(2); // Убираем '+7'
		formatted = '+7';
		
		if (numbers.length > 0) {
			formatted += ' (' + numbers.slice(0, 3);
		}
		if (numbers.length >= 3) {
			formatted += ') ' + numbers.slice(3, 6);
		}
		if (numbers.length >= 6) {
			formatted += '-' + numbers.slice(6, 8);
		}
		if (numbers.length >= 8) {
			formatted += '-' + numbers.slice(8, 10);
		}
		
		// Ограничиваем длину форматированного номера
		formatted = formatted.slice(0, getFormattedLength(numbers.length));
	}
	
	return formatted;
}

// Функция для удаления форматирования из номера телефона
function unformatPhoneNumber(value) {
	// Удаляем все нецифровые символы, кроме '+'
	let unformatted = value.replace(/[^\d+]/g, '');
	
	// Заменяем ведущую '8' на '+7'
	if (unformatted.startsWith('8')) {
		unformatted = '+7' + unformatted.slice(1);
	}
	
	// Если '+' не в начале, перемещаем его в начало
	if (unformatted.includes('+') && !unformatted.startsWith('+')) {
		unformatted = '+' + unformatted.replace(/\+/g, '');
	}
	
	// Если номер не начинается с '+7', заменяем на '+7'
	if (!unformatted.startsWith('+7')) {
		unformatted = '+7' + unformatted.replace(/^\+?/, '');
	}
	
	// Ограничиваем длину до 12 символов (например, '+7XXXXXXXXXX')
	unformatted = unformatted.slice(0, 12);
	
	return unformatted;
}

// Функция для вычисления максимальной длины форматированного номера
function getFormattedLength(digitsCount) {
	// digitsCount - количество цифр после '+7'
	let length = 3; // '+7'
	
	if (digitsCount >= 1) {
		length += 2 + Math.min(3, digitsCount); // ' (xxx'
	}
	if (digitsCount >= 4) {
		length += 2 + Math.min(3, digitsCount - 3); // ') xxx'
	}
	if (digitsCount >= 7) {
		length += 1 + Math.min(2, digitsCount - 6); // '-xx'
	}
	if (digitsCount >= 9) {
		length += 1 + Math.min(2, digitsCount - 8); // '-xx'
	}
	
	return length;
}
</script>

<style scoped>
/* Добавьте стили, если необходимо */
</style>