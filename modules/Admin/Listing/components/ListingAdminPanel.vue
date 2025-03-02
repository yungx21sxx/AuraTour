<script setup lang="ts">
	import BookingsAdminList from "~/modules/Admin/Listing/components/BookingsAdminList.vue";
	import {ListingBookingApi} from "~/modules/Admin/Listing/api/listingBookingApi";
	import useListing from "~/modules/Listing/composables/useListing";
	import BookingCalendar from "~/modules/Admin/Listing/components/BookingCalendarModal.vue";
	import BtnPrimary from "~/modules/Common/UI/BtnPrimary.vue";
	import {mdiPencil, mdiDeleteForeverOutline, mdiPlus} from "@mdi/js"
	import ListingStatistic from "~/modules/Admin/Listing/components/ListingStatistic.vue";
	import {useAuthUser} from "~/modules/Auth/composables/useAuthUser";
	
	const authUser = useAuthUser();
	
	const access = computed(() => {
		const fullAccess = authUser.value && ['ADMIN', 'MANAGER'].includes(authUser.value.role);
		let isListingOwner: boolean = false;
		
		if (listing.value.owner) {
			isListingOwner = authUser.value && authUser.value.id === listing.value.owner.id;
		}
		
		return {
			fullAccess,
			isListingOwner
		}
	})
	
	const {listing} = useListing()
	const tabsList = [
		{
			value: 1,
			name: 'Броинрования',
			disabled: false
		},
		{
			value: 2,
			name: 'Заметки',
			disabled: access.value.isListingOwner && !access.value.fullAccess
		},
		{
			value: 3,
			name: 'Статистика',
			disabled: false
		},
	]
	
	const tabs = computed(() => tabsList.filter(tab => !tab.disabled))
	
	
	
	const currentTab = ref(1);
	const {data, refresh, error} = await useAsyncData('listing-bookings', () => ListingBookingApi.fetchBookings(listing.value.id));
	
	const {data: listingNote} = await useFetch(`/api/listing-note/${listing.value.id}`)
	
	const noteText = ref(listingNote.value.note || '');
	
	const createNote = async () => {
		await useFetch(`/api/listing-note/${listing.value.id}`, {
			method: 'POST',
			body: {
				note: noteText.value
			}
		})
	}
	
	async function deleteListing() {
		await $fetch(`/api/listing/admin/${listing.value.id}`, {
			method: 'DELETE'
		})
		alert('Объект удален');
		await navigateTo({
			path: '/search'
		})
	}
	
	const listingDeleteSnackBar = ref(false);
	
	const managers = await $fetch('/api/users/load-managers');
	const selectedManagerId = ref(null);
	const errorMassage = ref<string | null>(null)
	
	const setManager = async () => {
		if (!selectedManagerId.value) {
			alert('Выберите менеджера');
			return;
		}
		try {
			await $fetch(`/api/listing/set-manager/${listing.value.id}`, {
				method: 'POST',
				body: {
					managerId: selectedManagerId.value
				}
			});
			alert('Менеджер назначен. Объект будет давален в каталог');
			errorMassage.value = null;
			window.location.reload();
		} catch (e) {
			console.log(e)
		}
	}
	
	const validateListingChanges = async () => {
		try {
			await $fetch(`/api/listing/confirm-changes/${listing.value.id}`);
			alert('Изменения подтверждены. Объект будет давален в каталог');
			errorMassage.value = null;
			window.location.reload();
		} catch (e) {
			console.log(e)
		}
	}
	
	const validateListing = async () => {
		if (!listing.value.manager) {
			await setManager()
		} else {
			await validateListingChanges();
		}
	}
	
</script>

<template>
	<div class="listing-block">
		
		<div class="mb-6" v-if="access.fullAccess && !listing.validated">
			<h3 class="mb-4">Модерация объекта</h3>
			<v-select
				v-if="!listing.manager"
				:items="managers"
				v-model="selectedManagerId"
				max-width="400px"
				item-value="id"
				item-title="fullName"
				label="Выберите менеджера"
			/>
			<v-alert v-else type="info" class="mb-4" text="Был запрос на редактирование объекта, опубликовать его?"></v-alert>
			<BtnPrimary @click="validateListing">Опубликовать объект</BtnPrimary>
		</div>
		<div class="mb-6 menu" v-if="access.fullAccess">
			<v-btn color="green" :href="`/admin/edit-listing/${listing.id}`" :prepend-icon="mdiPencil">Редактировать объект</v-btn>
			<v-btn color="blue" href="/admin/create-listing" :prepend-icon="mdiPlus" v-if="access.fullAccess">Создать объект</v-btn>
			<v-btn color="red" @click="listingDeleteSnackBar = true"  :prepend-icon="mdiDeleteForeverOutline">Удалить объект</v-btn>
		</div>
		<div class="mb-6 menu" v-else>
			<v-btn color="green" :href="`/lk/edit-listing/${listing.id}`" :prepend-icon="mdiPencil">Редактировать объект</v-btn>
			<v-btn color="red" @click="listingDeleteSnackBar = true"  :prepend-icon="mdiDeleteForeverOutline">Удалить объект</v-btn>
		</div>
		<v-tabs
			v-model="currentTab"
			align-tabs="center"
			color="deep-purple-accent-4"
		>
			<v-tab
				v-for="tab of tabs"
				:value="tab.value"
			>{{tab.name}}</v-tab>
		</v-tabs>
		<v-tabs-window v-model="currentTab">
			<v-tabs-window-item :value="1">
				<BookingsAdminList v-if="data" :bookings="data.bookings"/>
			</v-tabs-window-item>
			<v-tabs-window-item :value="2">
				<v-textarea auto-grow label="Заметка" class="mt-4" v-model="noteText"/>
				<BtnPrimary @click="createNote">Сохранить</BtnPrimary>
			</v-tabs-window-item>
			<v-tabs-window-item :value="3">
				<ListingStatistic/>
			</v-tabs-window-item>
		</v-tabs-window>
	
	</div>
	<v-snackbar
		v-model="listingDeleteSnackBar"
		multi-line
	>
		Точно хотите удалить?
		
		<template v-slot:actions>
			<v-btn
				color="red"
				variant="text"
				class="mr-5"
				@click="deleteListing"
			>
				Да
			</v-btn>
			<v-btn
				variant="text"
				@click="listingDeleteSnackBar = false"
			>
				Нет
			</v-btn>
		</template>
	</v-snackbar>
	
</template>

<style scoped lang="scss">

	.menu {
		display: flex;
		gap: 16px;
		justify-content: center;
		
		@media screen and (max-width: 600px) {
			flex-direction: column;
		}
	}

</style>