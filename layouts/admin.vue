<template>
	<v-app>
		<v-layout>
			<v-app-bar
				color="primary"
			>
				<v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
				
				<v-toolbar-title>Админка</v-toolbar-title>
				<v-spacer></v-spacer>
				<v-btn :prepend-icon="mdiMagnify" @click="userSearchDialog = true" >Пользователи</v-btn>
			</v-app-bar>
			
			<v-navigation-drawer
				v-model="drawer"
				temporary
			>
				<v-list>
					<v-list-item
						:title="`${authUser.name} ${authUser.surname || ''}`"
						:subtitle="authUser.email"
					>
						<template #prepend>
							<v-avatar v-if="authUser.avatar">
								<v-img :src="authUser.avatar"/>
							</v-avatar>
							<v-avatar v-else color="#7059FF">{{authUser.name[0]}}</v-avatar>
						</template>
					</v-list-item>
				</v-list>
				<v-divider></v-divider>
				<v-list density="compact" nav>
					<v-list-item title="Бронирования" value="myfiles" href="/admin/bookings"></v-list-item>
					<v-list-item title="Статистика" value="shared" href="/admin/statistics"></v-list-item>
					<v-list-item title="Объекты на модерации" value="starred" href="/admin/moderation"></v-list-item>
					<v-list-item title="Создать объект" value="starred" href="/admin/create-listing"></v-list-item>
				</v-list>
				<BtnSecondary block href="/">Назад на главную</BtnSecondary>
			</v-navigation-drawer>
			
			<v-main>
				<div class="admin-wrapper">
					<slot/>
				</div>
			</v-main>
		</v-layout>
		
		<UserSearchDialog v-model:is-open="userSearchDialog" @onUserSelect="onUserSelect"/>
	</v-app>
 
	
</template>

<script setup lang="ts">
	import {useAuthUser} from "~/modules/Auth/composables/useAuthUser";
	import {mdiMagnify} from "@mdi/js";
	import BtnSecondary from "~/modules/Common/UI/BtnSecondary.vue";
	import UserSearchDialog from "~/modules/Admin/Listing/components/UserSearchDialog.vue";
	import type {ListingBookingUserResponse} from "~/modules/Admin/Listing/types/response.types";
	
	const authUser = useAuthUser();
	const drawer = ref(false)
	const route = useRoute();
	const linkParts = route.fullPath.split('/')
	const currentPage = ref<string>(
		linkParts[linkParts.length - 1]
	)
	async function logout() {
		await useFetch('/api/auth/logout');
		navigateTo('/')
	}
	
	const userSearchDialog = ref(false);
	
	const onUserSelect = async (user: ListingBookingUserResponse) => {
		await navigateTo({
			path: `/admin/user/${user.id}`
		})
	}
</script>

<style scoped>
	.admin-wrapper {
		max-width: 1150px;
		margin: 24px auto;
	}
</style>