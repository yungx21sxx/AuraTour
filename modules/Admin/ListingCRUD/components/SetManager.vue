<script setup lang="ts">
import useCreateListing from "~/modules/Admin/ListingCRUD/composables/useCreateListing";
import BtnPrimary from "~/modules/Common/UI/BtnPrimary.vue";
import UserSearchDialog from "~/modules/Admin/Shared/UserSearchDialog.vue";
import type {ListingBookingUserResponse} from "~/modules/Admin/Listing/types/response.types";
import {useAuthUser} from "~/modules/Auth/composables/useAuthUser";
import {mdiDelete} from "@mdi/js";

const authUser = useAuthUser();
const {listingFormData, initialData, ownerData} = useCreateListing();

if (authUser.value && authUser.value.role === 'MANAGER') {
	listingFormData.value.managerId = authUser.value.id
}



const userSearchModal = ref(false);

const setOwner = (owner: ListingBookingUserResponse) => {
	ownerData.value = owner;
	listingFormData.value.ownerId = owner.id;
	userSearchModal.value = false;
}

const deleteOwner = () => {
	ownerData.value = null;
	listingFormData.value.ownerId = null;
}

</script>

<template>
	<v-card class="mt-4 mb-4">
		<v-card-title>Назначить менеджера</v-card-title>
		<v-card-item>
			<v-select
				variant="outlined"
				v-model="listingFormData.managerId"
				:items="initialData.managers"
				item-title="fullName"
				item-value="id"
			/>
		</v-card-item>
		<v-card-title>Аккаунт владельца</v-card-title>
		<v-card-text>Его указывать не обязательно</v-card-text>
		<v-card-item>
			<BtnPrimary @click="userSearchModal = true">{{ownerData ? 'Изменить владельца' : 'Поиск пользователей'}}</BtnPrimary>
			<UserSearchDialog v-model:is-open="userSearchModal" @onUserSelect="setOwner"/>
			<v-list v-if="ownerData" class="mt-4">
				<v-list-item
					:title="`${ownerData.name} ${ownerData.surname || ''}`"
					:subtitle="ownerData.email"
					style="max-width: 400px"
				>
					<template #prepend>
						<v-avatar color="#7059FF">{{ownerData.name[0]}}</v-avatar>
					</template>
					<template #append>
						<v-btn @click="deleteOwner" variant="tonal" color="red" :icon="mdiDelete"/>
					</template>
				</v-list-item>
			</v-list>
			
		</v-card-item>
	</v-card>

</template>

<style scoped lang="scss">

</style>