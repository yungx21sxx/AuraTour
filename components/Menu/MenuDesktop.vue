<script setup lang="ts">

import useFavorites from "~/components/pages/Favorites/useFavorites";

const authUser = useAuthUser();
const {authModalIsOpen, logout} = useAuth();
const {favoriteListingIDs} = useFavorites();

const isAdmin = useAdmin();
let elevationValue = ref(0)

onMounted(() => {
	window.addEventListener('scroll', onScroll)
})


//@ts-ignore
const onScroll = (event: any) => {
	if (window) {
		//@ts-ignore
		elevationValue.value = window.top.scrollY > 20 ? 2 : 0
	}
}


</script>

<template>
	<v-app-bar density="comfortable" :elevation="elevationValue" color="rgba(255,255,255,1)">
		<div class="nav">
			<NuxtLink to="/" class="nav__logo nav__logo_desktop">
				
				<NuxtIcon name="nav/text-logo-blue" class="nav__logo-text" filled/>
			</NuxtLink>
			<div class="nav__menu">
				<v-btn class="nav__link" href="/">
					<template #prepend>
						<NuxtIcon name="menu/home" filled/>
					</template>
					Главная
				</v-btn>
				<v-btn class="nav__link" href="/search">
					<template #prepend>
						<NuxtIcon name="menu/search" filled/>
					</template>
					Поиск
				</v-btn>
				<v-btn class="nav__link" href="/favorites">
					<template #prepend>
						<NuxtIcon name="menu/like" filled/>
					</template>
					Избранное
					<template #append>
						<v-badge
							color="info"
							v-if="favoriteListingIDs.length > 0"
							:content="favoriteListingIDs.length"
							inline
						></v-badge>
					</template>
				</v-btn>
				<v-btn class="nav__link" href="/help">
					<template #prepend>
						<NuxtIcon name="menu/help" filled/>
					</template>
					Помощь
				</v-btn>
				
				
				
			</div>
			<div class="nav__right">
				
				<v-btn variant="tonal"
				       color="#7059FF"
				       prepend-icon="mdi-account-circle-outline"
				       @click="authModalIsOpen = true"
				       v-if="!authUser"
				>
					Войти
				</v-btn>
				<v-btn variant="tonal"
				       color="#7059FF"
				       prepend-icon="mdi-account-circle-outline"
				       v-else-if="!isAdmin"
				       href="/lk/edit"
				>
					Личный кабинет
				</v-btn>
				<v-btn variant="tonal"
				       color="#7059FF"
				       prepend-icon="mdi-account-circle-outline"
				       href="/admin/bookings"
				       v-else
				>
					Админка
				</v-btn>
				<v-btn v-if="authUser" @click="logout"  color="#7059FF" variant="text" prepend-icon="mdi-logout">Выйти</v-btn>
				<v-btn icon="mdi-instagram" density="comfortable" href="https://www.instagram.com/reel/C3-uB8sIlkW/?igsh=MXE4OTM4djBqcDZsNA=="></v-btn>
<!--				<v-btn icon="mdi-whatsapp"  density="comfortable"  ></v-btn>-->
			</div>
		</div>
	
	</v-app-bar>
	<div class="overlay">
	
	</div>
</template>

<style scoped lang="scss">

.overlay {
	height: 56px;
}

@media screen and (max-width: 950px) {
	.nav__btn {
		display: none;
	}
	
}
	
.nav {
	width: 100%;
	padding-left: 16px;
	&, &__logo, &__right {
		display: flex;
		align-items: center;
	}
	

	&__logo {
		gap: 8px;
		img {
			height: 30px;
		}
	}
	
	&__menu {
		margin-left: 32px;
	}
	
	&__right {
		margin-left: auto;
		display: flex;
		gap: 8px;
	}
}


</style>