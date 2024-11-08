<script setup lang="ts">
import {
	mdiAccount,
	mdiCalendarClockOutline,
	mdiChevronLeft,
	mdiChevronRight,
	mdiHomeCityOutline, mdiHomePlusOutline,
	mdiLogout
} from "@mdi/js";
	import BtnSecondary from "~/modules/Common/UI/BtnSecondary.vue";
	import {useAuthUser} from "~/modules/Auth/composables/useAuthUser";
	
	const authUser = useAuthUser();
	const {isMobile} = useDevice();
	const drawer = ref(false)

</script>

<template>
	<v-app>
		<v-layout>
			<v-app-bar
				color="primary"
				prominent
			>
				<v-app-bar-nav-icon v-if="isMobile" variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
				
				<v-toolbar-title>Личный кабинет</v-toolbar-title>
				
				<v-spacer v-if="!isMobile"></v-spacer>
				
				<template v-if="!isMobile">
					<VBtn :prepend-icon="mdiLogout">Выйти из аккаунта</VBtn>
				</template>
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
					<v-list-item title="Мой профиль" :prepend-icon="mdiAccount" href="/lk/profile"></v-list-item>
					<v-list-item title="Бронирования" :prepend-icon="mdiCalendarClockOutline" value="shared" href="/lk/bookings"></v-list-item>
					<v-list-item title="Мои объекты" :prepend-icon="mdiHomeCityOutline" value="starred" href="/lk/listings"></v-list-item>
					<v-list-item title="Загрузить объект" :prepend-icon="mdiHomePlusOutline" value="starred" href="/lk/create-listing"></v-list-item>
				</v-list>
				<BtnSecondary block href="/">Назад на главную</BtnSecondary>
			</v-navigation-drawer>
			<v-main v-if="isMobile">
				<div class="lk-wrapper">
					<slot/>
				</div>
				
			</v-main>
			<v-main v-else>
				<div class="wrapper">
					<div class="grid">
						<div class="nav-menu">
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
								<v-list-item title="Мой профиль" :prepend-icon="mdiAccount" href="/lk/profile"></v-list-item>
								<v-list-item title="Бронирования" :prepend-icon="mdiCalendarClockOutline" value="shared" href="/lk/bookings"></v-list-item>
								<v-list-item title="Мои объекты" :prepend-icon="mdiHomeCityOutline" value="starred" href="/lk/listings"></v-list-item>
								<v-list-item title="Загрузить объект" :prepend-icon="mdiHomePlusOutline" value="starred" href="/lk/create-listing"></v-list-item>
							</v-list>
							<BtnSecondary block href="/">Назад на главную</BtnSecondary>
						</div>
						<div class="content">
							<slot/>
						</div>
						
					</div>
				
				</div>
			</v-main>
		</v-layout>
		
	</v-app>
	

</template>

<style scoped lang="scss">

.grid {
	display: grid;
	grid-template-columns: 250px 1fr;
	gap: 48px;
	margin-top: 32px;
}

.lk-wrapper {
	padding: 16px;
}

</style>