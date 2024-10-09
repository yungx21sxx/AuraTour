<script setup lang="ts">
	import useFavorites from "~/components/pages/Favorites/useFavorites";
	
	const menuPosition = ref(1);
	
	const authUser = useAuthUser();
	const {authModalIsOpen, logout} = useAuth()
	const isAdmin = useAdmin();
	const showAuthAlert = ref(false);
	const router = useRouter()
	const {favoriteListingIDs} = useFavorites();
	
	const isFavoritesAdded = computed(() => favoriteListingIDs.value.length > 0)
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
	<v-app-bar color="rgba(255,255,255, 1)"  density="comfortable" :elevation="elevationValue">
		<template #prepend>
			<NuxtLink to="/" class="nav__logo nav__logo_mobile">
				<NuxtIcon name="nav/text-logo-blue" class="nav__logo-text" filled/>
			</NuxtLink>
		</template>
		<template #append>
			<div class="nav__right">
				<!--				<v-btn icon="mdi-heart-outline"/>-->
				<v-dialog
					fullscreen
				>
					<template v-slot:activator="{ props: activatorProps }">
						<VBtn :icon="true" variant="text" v-ripple color="#FAAC37" aria-label="Name" v-bind="activatorProps">
							<v-badge dot color="#7059FF" v-model="isFavoritesAdded">
								<NuxtIcon name="nav/burger" class="nav__burger" filled/>
							</v-badge>
						</VBtn>
					</template>
					<template v-slot:default="{ isActive }">
						<v-card>
							<v-toolbar color="white">
								<template #prepend>
									<div class="nav__logo nav__logo_mobile ml-2">
										<NuxtIcon name="nav/text-logo-blue" class="nav__logo-text" filled/>
									</div>
								</template>
								<template #append>
									<v-btn @click="isActive.value = false" icon="mdi-close"></v-btn>
								</template>
							</v-toolbar>
							
							<div class="nav__body">
								<v-window v-model="menuPosition">
									<v-window-item :value="1">
										<v-card @click="menuPosition += 1"  elevation="0" class="nav__search" color="#F0F3F7">
											<NuxtIcon class="nav__icon" name="menu/search" filled/>
											<span>Выберите курорт | Даты</span>
										</v-card>
									
										<v-card elevation="0" class="nav__link" href="/" >
											<NuxtIcon class="nav__icon" name="menu/home" filled/>
											<span>Главная</span>
										</v-card>
										<v-card elevation="0" class="nav__link" href="/search" >
											<NuxtIcon class="nav__icon" name="menu/search" filled/>
											<span>Поиск</span>
										</v-card>
										<v-expand-transition>
											<div v-if="showAuthAlert" class="d-flex align-center justify-center flex-wrap text-center mx-auto px-4">
												<p class="text-body-2 mb-4 mt-4">
													Войдите или создайте аккаунт, чтобы управлять своими бронированиями.
												</p>
												<v-btn width="100%" color="#7059FF" variant="tonal" @click="authModalIsOpen = true">Войти</v-btn>
											</div>
										</v-expand-transition>
										
										<v-card elevation="0" class="nav__link" href="/favorites">
											<v-badge dot color="#7059FF" v-model="isFavoritesAdded">
												<NuxtIcon class="nav__icon" name="menu/like" filled/>
											</v-badge>
											<span>Избранное</span>
										</v-card>
										<v-card elevation="0" class="nav__link" href="/help">
											<NuxtIcon class="nav__icon" name="menu/help" filled/>
											<span>
												Помощь
											</span>
										</v-card>
										<div style="margin: 16px">
											<v-btn width="100%"
											       color="#7059FF"
											       prepend-icon="mdi-account"
											       @click="authModalIsOpen = true"
											       v-if="!authUser"
											>Войти или создать аккаунт</v-btn>
											<v-btn width="100%"
											       color="#7059FF"
											       prepend-icon="mdi-account"
											       variant="tonal"
											       href="/lk/edit"
											       v-else-if="!isAdmin"
											>Личный кабинет</v-btn>
											<v-btn width="100%"
											       color="#7059FF"
											       prepend-icon="mdi-account"
											       variant="tonal"
											       href="/admin/bookings"
											       v-else
											>Админка</v-btn>
											<v-btn v-if="authUser" @click="logout" class="mt-4" color="#7059FF" width="100%" variant="text" prepend-icon="mdi-logout">Выйти</v-btn>
										
										</div>
										
									</v-window-item>
									<v-window-item :value="2">
										<v-chip @click="menuPosition -= 1" color="#7059FF" prepend-icon="mdi-chevron-left" class="ml-2 mb-4">Назад</v-chip>
										<BookingMainForm @submit="isActive.value = false"/>
									</v-window-item>
								</v-window>
								
							</div>
						</v-card>
					</template>
				</v-dialog>
			
			</div>
		</template>
		
		
	
	</v-app-bar>
	
	<div class="overlay">
	
	</div>
	
	
	
	
</template>

<style scoped lang="scss">

.overlay {
	height: 56px;
}

.expend-icon {
	margin-left: auto;
	margin-right: -16px;
}

.nav {
	width: 100%;
	padding: 0 16px;
	&__body {
		padding: 0 8px;
	}
	
	&__search {
		margin-top: 16px;
		margin-bottom: 16px;
		display: flex;
		align-items: center;
		gap: 16px;
		height: 50px;
		padding-left: 16px;
	}
	
	&, &__logo, &__right {
		display: flex;
		align-items: center;
	}
	&__link {
		display: flex;
		align-items: center;
		gap: 16px;
		padding: 16px;
		span {
			font-size: 14px;
			font-weight: bold;
		}
	}
	&__logo {
		gap: 8px;
		margin-left: 4px;
		img {
			height: 24px;
		}
	}
	&__right {
		margin-left: auto;
	}
}

</style>