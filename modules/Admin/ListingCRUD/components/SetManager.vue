<script setup lang="ts">
import useCreateListing from "~/modules/Admin/ListingCRUD/composables/useCreateListing";
import BtnPrimary from "~/modules/Common/UI/BtnPrimary.vue";
import UserSearchDialog from "~/modules/Admin/Shared/UserSearchDialog.vue";
import type {ListingBookingUserResponse} from "~/modules/Admin/Listing/types/response.types";

const {listingFormData, initialData} = useCreateListing();

const userSearchModal = ref(false);
const ownerData = ref<ListingBookingUserResponse | null>(null);

const setOwner = (owner: ListingBookingUserResponse) => {
	ownerData.value = owner;
	listingFormData.value.ownerId = owner.id;
	userSearchModal.value = false;
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
				>
					<template #prepend>
						<v-avatar v-if="ownerData.avatar" :src="ownerData.avatar"/>
						<v-avatar v-else color="#7059FF">{{ownerData.name[0]}}</v-avatar>
					</template>
				</v-list-item>
			</v-list>
			
		</v-card-item>
	</v-card>

</template>

<style scoped lang="scss">

</style>