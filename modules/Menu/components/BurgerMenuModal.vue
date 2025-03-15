<script setup lang="ts">
	import useBurgerMenu from "~/modules/Menu/composables/useBurgerMenu";
	import {useAuthUser} from "~/modules/Auth/composables/useAuthUser";
	import {
		mdiAccountCircleOutline,
		mdiChevronLeft,
		mdiClose,
		mdiHomeVariantOutline,
		mdiLogout,
		mdiMagnify
	} from "@mdi/js";
	import BookingMainForm from "~/modules/Booking/components/BookingMainForm.vue";
	import MainLogo from "~/modules/Menu/icons/MainLogo.vue";
	import useFavorites from "~/components/pages/Favorites/useFavorites";
	import UserIcon from "~/modules/Menu/icons/UserIcon.vue";
	import LikeIcon from "~/modules/Menu/icons/LikeIcon.vue";
	import HelpIcon from "~/modules/Menu/icons/HelpIcon.vue";
	import InfoIcon from "~/modules/Menu/icons/InfoIcon.vue";
	import BtnPrimary from "~/modules/Common/UI/BtnPrimary.vue";
	import useSearch from "~/modules/Booking/composables/useSearch";
	import BtnSecondary from "~/modules/Common/UI/BtnSecondary.vue";
	import useAuthModal from "~/modules/Auth/composables/useAuthModal";
	import {useAuth} from "~/modules/Auth/composables/useAuth";
	import useLandLordModal from "~/modules/Common/useLandLordModal";
	const {searchData} = useSearch();
	const menu = ref(true)
	const authUser = useAuthUser();
	
	const {logout} = useAuth()
	const {burgerMenuIsOpen, open, close} = useBurgerMenu();
	const menuPosition = ref(1);
	
	const {openAuthModal} = useAuthModal();
	
	const landLordModal = useLandLordModal();
</script>

<template>
	<v-dialog fullscreen v-model="burgerMenuIsOpen">
		<v-card class="nav">
			<div class="toolbar">
				<NuxtLink to="/" external style="display: flex; align-items: center">
					<MainLogo :variant="'dark'" class="toolbar__logo"/>
				</NuxtLink>
				
				<v-icon :icon="mdiClose" @click="close"></v-icon>
			</div>
			<div>
				<v-window v-model="menuPosition">
					<v-window-item :value="1">
						<div class="nav__body">
							<v-card @click="menuPosition += 1"  elevation="0" class="nav__search" color="#F0F3F7">
								<v-icon :icon="mdiMagnify"/>
								<span class="ml-2">Выберите курорт | Даты</span>
							</v-card>
							<NuxtLink class="nav__link" v-if="!authUser"  @click="openAuthModal">
								<UserIcon class="nav__icon"/>
								<span>Личный кабинет</span>
							</NuxtLink>
							<NuxtLink class="nav__link" to="/favorites" external>
								<LikeIcon class="nav__icon" />
								<span>Избранное</span>
							</NuxtLink>
							<NuxtLink class="nav__link" to="/help" external>
								<HelpIcon class="nav__icon" />
								<span>Помощь</span>
							</NuxtLink>
							<NuxtLink class="nav__link" to="/about" external>
								<InfoIcon class="nav__icon" />
								<span>О нас</span>
							</NuxtLink>
							<BtnPrimary block v-if="!authUser" :prepend-icon="mdiHomeVariantOutline" @click="landLordModal = true">Сдать жилье</BtnPrimary>
							<div v-else style="margin: 0 -20px">
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
									<v-list>
										<v-list-item>
											<BtnPrimary
												:prepend-icon="mdiAccountCircleOutline"
												v-if="['MANAGER', 'ADMIN'].includes(authUser.role)"
												href="/admin/bookings"
												block
												class="mb-2"
											>Админка</BtnPrimary>
											<BtnPrimary
												:prepend-icon="mdiAccountCircleOutline"
												v-if="authUser"
												href="/lk/profile"
												block
											>Личный кабинет</BtnPrimary>
										</v-list-item>
										<v-list-item>
											<BtnSecondary href="/lk/listings" block :prepend-icon="mdiHomeVariantOutline">Мои объекты</BtnSecondary>
										</v-list-item>
										<v-list-item>
											<BtnSecondary @click="logout" block :prepend-icon="mdiLogout">Выйти</BtnSecondary>
										</v-list-item>
									</v-list>
							</div>
						</div>
						<div class="nav__cities">
							<div class="nav__title">Популярные направления</div>
							<div class="nav__chips">
								<NuxtLink
									class="nav__chip"
									v-for="city of searchData.cities.slice(0, 6)"
									:key="city.id"
									external
									:to="`/search/city/${city.slug}`"
								>{{city.cityName}}</NuxtLink>
							</div>
						</div>
						<div class="nav__cities">
							<div class="nav__title">Типы жилья</div>
							<div class="nav__chips">
								<NuxtLink
									class="nav__chip"
									v-for="type of searchData.listingTypes"
									:key="type.id"
									external
									:to="`/search/type/${type.slug}`"
								>{{type.name}}</NuxtLink>
							</div>
						</div>
					</v-window-item>
					<v-window-item :value="2">
						<div style="padding: 20px 16px">
							<v-chip @click="menuPosition -= 1" color="#7059FF" :prepend-icon="mdiChevronLeft" class="mb-6">Назад</v-chip>
							<BookingMainForm @submit="close"/>
						</div>
					</v-window-item>
				</v-window>
			
			</div>
		</v-card>
	</v-dialog>
	
</template>

<style scoped lang="scss">

.toolbar {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 16px 20px;
	border-bottom: 1px solid #F0F2F9;
	&__logo {
		height: 24px;
		width: auto;
	}
}

.nav {
	&__body {
		display: flex;
		flex-direction: column;
		gap: 24px;
		padding: 20px 16px;
		border-bottom: 1px solid #F0F2F9;
	}
	
	&__chip {
		background: #F1F3F9;
		border-radius: 8px;
		padding: 4px 16px;
		color: #2A2536;
	}
	
	&__chips {
		display: flex;
		flex-wrap: wrap;
		gap: 16px;
		margin-top: 16px;
	}
	
	&__cities {
		padding: 16px 20px;
	}
	
	&__link {
		display: flex;
		align-items: center;
		gap: 12px;
		color: #2A2536;
	}
	
	&__search {
		border-radius: 16px;
		padding: 10px 16px;
	}
}

</style>