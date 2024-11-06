<template>
	<v-dialog v-model="isOpen" max-width="600px" :fullscreen="isMobile">
		<v-card>
			<v-toolbar>
				<v-btn @click="closeDialog" :icon="mdiClose"/>
				<span>Поиск пользователя</span>
			</v-toolbar>
			
			<v-card-text>
				<v-select
					v-model="searchType"
					:items="searchTypes"
					label="Тип поиска"
				></v-select>
				<v-text-field
					v-model="searchQuery"
					:label="`Поиск по: ${searchType.toLowerCase()}`"
					@input="onSearchInput"
				></v-text-field>
				
			
					<v-list-item
						v-for="user in searchResults"
						:key="user.id"
						@click="selectUser(user)"
					>
						<template #prepend>
							<v-avatar color="primary">
								{{ user.name.charAt(0) }}
							</v-avatar>
						</template>
							<v-list-item-title>
								{{ user.name }} {{ user.surname }}
							</v-list-item-title>
							<v-list-item-subtitle>
								Телефон: {{ user.phone || 'не указан' }}
							</v-list-item-subtitle>
							<v-list-item-subtitle>
								Email: {{ user.email || 'не указан' }}
							</v-list-item-subtitle>
					</v-list-item>
				
				
				<div v-if="searchResults.length === 0 && searchQuery.trim() !== ''">
					<v-divider class="my-4"></v-divider>
					<p>Пользователи не найдены</p>
				</div>
			</v-card-text>
			
			<v-card-actions>
				<v-spacer></v-spacer>
				<v-btn text color="primary" @click="closeDialog">Закрыть</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { useFetch } from '#app';
import {mdiClose} from "@mdi/js";
import type {ListingBookingUserResponse} from "~/modules/Admin/Listing/types/response.types";


const props = defineProps<{
	isOpen: boolean;
}>();

// Эмитируемые события
const emit = defineEmits(['update:isOpen', 'onUserSelect']);
const {isMobile} = useDevice()

// Реактивные переменные
const isOpen = ref(props.isOpen);
const searchType = ref('Имя и Фамилия');
const searchQuery = ref('');
const searchResults = ref<ListingBookingUserResponse[]>([]);
const isLoading = ref(false);

// Типы поиска
const searchTypes = ['Имя и Фамилия', 'Телефон', 'Email'];

// Синхронизация isOpen с родительским компонентом
watch(
	() => props.isOpen,
	(newVal) => {
		isOpen.value = newVal;
		if (newVal) {
			resetSearch();
		}
	}
);

// Эмитируем обновление isOpen для v-model
watch(isOpen, (newVal) => {
	emit('update:isOpen', newVal);
});

// Функция для обработки ввода поиска с debounce
let searchTimeout: ReturnType<typeof setTimeout>;
function onSearchInput() {
	clearTimeout(searchTimeout);
	searchTimeout = setTimeout(() => {
		performSearch();
	}, 500);
}

// Функция для выполнения поиска
async function performSearch() {
	if (searchQuery.value.trim() === '') {
		searchResults.value = [];
		return;
	}
	
	isLoading.value = true;
	
	// Построение параметров запроса
	let params: Record<string, string> = {};
	if (searchType.value === 'Имя и Фамилия') {
		params.search = searchQuery.value;
	} else if (searchType.value === 'Телефон') {
		params.phone = searchQuery.value;
	} else if (searchType.value === 'Email') {
		params.email = searchQuery.value;
	}
	try {
		// Запрос к API
		const { data, error } = await useFetch<ListingBookingUserResponse[]>('/api/users/search', {
			query: {
				...params
			},
		});
		
		if (error.value) {
			console.error('Ошибка при поиске пользователей:', error.value);
			// Обработка ошибки
			isLoading.value = false;
			return;
		}
		
		if (data.value) {
			searchResults.value = data.value;
		}
	} catch (err) {
		console.error('Ошибка запроса:', err);
	} finally {
		isLoading.value = false;
	}
}

// Функция для выбора пользователя
function selectUser(user: ListingBookingUserResponse) {
	emit('onUserSelect', user);
	closeDialog();
}

// Функция для закрытия диалога
function closeDialog() {
	isOpen.value = false;
}

// Сброс поиска при открытии диалога
function resetSearch() {
	searchQuery.value = '';
	searchResults.value = [];
	isLoading.value = false;
}
</script>

<style scoped>
/* Добавьте стили по необходимости */
</style>