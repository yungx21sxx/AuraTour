<template>
    <nav class="nav">
        <div class="wrapper nav__body">
	        <NuxtLink to="/" external style=" width: fit-content; display: flex; flex-direction: column; justify-content: center " aria-label="Главная страница">
		        <MainLogo class="nav__logo" :variant="variant" />
	        </NuxtLink>
            <div class="nav__links">
                <v-menu open-on-hover transition="scale-transition" class="nav__cities">
                    <template v-slot:activator="{ props }">
                        <v-btn
                            class="nav__search search"
                            variant="text"
                            :append-icon="mdiChevronDown"
                            v-bind="props"
                            :color="color"
                        >
                            Направления
                        </v-btn>
                    </template>
                    <v-card max-width="350">
                        <v-card-item>
	                        <h4 class="mt-2 mb-4">Популярные направления</h4>
	                        <div style="display: flex; flex-wrap: wrap; gap: 12px;">
		                        <v-chip
			                        v-for="city of searchData.cities.slice(0,8)"
			                        :key="city.id"
			                        variant="outlined"
			                        color="#333D46"
			                        :href="`/search/city/${city.slug}`"
		                        >{{city.cityName}}</v-chip>
	                        </div>
	                        <h4 class="mt-8 mb-4">Типы жилья</h4>
	                        <div style="display: flex; flex-wrap: wrap; gap: 12px; margin-bottom: 16px;">
		                        <v-chip
			                        v-for="type of searchData.listingTypes.slice(0,5)"
			                        :key="type.id"
			                        variant="outlined"
			                        color="#333D46"
			                        :href="`/search/type/${type.slug}`"
		                        >{{type.name}}</v-chip>
	                        </div>
                        </v-card-item>
                    </v-card>
                </v-menu>
                <v-btn
                    class="nav__link"
                    :color="color"
                    variant="text"
                    aria-label="О нас"
                    to="/about"
                    >О нас</v-btn
                >
                <v-btn
                    class="nav__link"
                    :color="color"
                    variant="text"
                    aria-label="Помощь"
                    to="/help"
                    >Помощь</v-btn
                >
            </div>
            <div class="nav__right">
	            <v-btn
		            class="nav__cities"
		            variant="text"
		            :prepend-icon="mdiHeartOutline"
		            :color="color"
		            to="/favorites"
		            aria-label="Избранное"
	            >
		            Избранное
	            </v-btn>
	            <div :class="['divider', {
					'divider_dark': variant === 'dark'
	            }]"></div>
	            <v-btn
		            class="nav__cities"
		            variant="text"
		            :prepend-icon="mdiAccountCircleOutline"
		            :color="color"
		            @click="openAuthModal"
		            v-if="!authUser"
	            >
		            Войти
	            </v-btn>
	            <v-menu open-on-hover transition="scale-transition" v-else>
		            <template v-slot:activator="{ props }">
			            <v-btn
				            class="nav__search search"
				            variant="text"
				            :prepend-icon="mdiAccountCircleOutline"
				            v-bind="props"
				            :color="color"
			            >
				            {{authUser.name}}
			            </v-btn>
		            </template>
		            <v-card min-width="300">
			            <v-card-item>
				           <v-list>
					           <v-list-item
						           :title="`${authUser.name} ${authUser.surname || ''}`"
						           :subtitle="authUser.email"
					           >
						           <template #prepend>
							           <v-avatar v-if="authUser?.avatar">
								           <v-img :src="authUser?.avatar"/>
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
						            <BtnSecondary block href="/lk/listings" :prepend-icon="mdiHomeVariantOutline">Мои объекты</BtnSecondary>
					            </v-list-item>
					            <v-list-item>
						            <BtnSecondary block :prepend-icon="mdiLogout" @click="logout">Выйти</BtnSecondary>
					            </v-list-item>
				            </v-list>
				            
				        
			            </v-card-item>
		            </v-card>
	            </v-menu>
	            <div :class="['divider', {
					'divider_dark': variant === 'dark'
	            }]"></div>
	            <VBtn icon variant="text" external aria-label="Instagram" target="_blank" href="https://www.instagram.com/aura_tur_abkhazia?igsh=ejVkeXV2dDV2YzB0">
		            <InstMenuIcon :variant="variant"/>
	            </VBtn>
	            <VBtn icon variant="text" aria-label="Telegram" external class="telega" target="_blank" href="https://t.me/laura_tour">
		            <TelegaMenuIcon :variant="variant"/>
	            </VBtn>
                <BtnPrimary class="nav__btn" @click="landLordInfoModalIsOpen = true">Сдать жилье</BtnPrimary>
            </div>
            <v-btn
                icon
                density="comfortable"
                variant="text"
                class="nav__burger"
                @click="open"
            >
                <BurgerIcon :variant="variant"/>
            </v-btn>
        </div>
    </nav>
</template>

<style lang="scss" scoped>
.telega {
	margin-left: -6px;
}
h4 {
	color: $text-gray;
}
.nav {
    padding: 4px 0;

    &__burger {
        display: none;
    }
    &__body {
        display: flex;
        align-items: center;
    }
    &__logo {
        height: 26px;
        width: auto;
    }
    &__links {
        margin-left: 16px;
    }
    &__right {
        margin-left: auto;
	    display: flex;
	    align-items: center;
    }
	
	.divider {
		background: rgba(white, .4);
		height: 24px;
		width: 1px;
		
		&_dark {
			background: rgba($text-main, .5);
		}
	}
    &__btn {
        margin-left: 10px;
    }

    @media screen and (max-width: 900px) {
        &__link {
            display: none;
        }
	    &__btn {
		    display: none;
	    }
	    &__burger {
		    display: block;
		    margin-left: auto;
		    margin-right: -8px;
		    
		    svg {
			    height: 30px;
			    width: auto;
		    }
	    }
	    
    }
    @media screen and (max-width: 730px) {
	    padding: 7px 0;
        &__right, .divider {
            display: none;
        }
        &__logo {
            height: 25px;
            width: auto;
        }
    }
	@media screen and (max-width: 500px) {
		&__search {
			display: none;
		}
	}
	
}
</style>

<script setup lang="ts">
import { mdiMapMarkerOutline } from '@mdi/js';
import { mdiLogout } from '@mdi/js';
import { mdiHomeVariantOutline } from '@mdi/js';
import BurgerIcon from "../icons/BurgerIcon.vue";
import useAuthModal from "~/modules/Auth/composables/useAuthModal";
import {useAuthUser} from "~/modules/Auth/composables/useAuthUser";
import { mdiChevronDown } from "@mdi/js";
import { mdiHeartOutline } from "@mdi/js";
import { mdiAccountCircleOutline } from "@mdi/js";
import useBurgerMenu from "~/modules/Menu/composables/useBurgerMenu";
import BtnPrimary from "~/modules/Common/UI/BtnPrimary.vue";
import type { MenuVariants } from "~/modules/Menu/types/menu.types";
import MainLogo from "~/modules/Menu/icons/MainLogo.vue";
import BtnSecondary from "~/modules/Common/UI/BtnSecondary.vue";
import useSearch from "~/modules/Booking/composables/useSearch";
import {useAuth} from "~/modules/Auth/composables/useAuth";
import useLandLordModal from "~/modules/Common/useLandLordModal";
import InstMenuIcon from "~/modules/Menu/icons/InstMenuIcon.vue";
import TelegaMenuIcon from "~/modules/Menu/icons/TelegaMenuIcon.vue";
const landLordInfoModalIsOpen = useLandLordModal()

const { open } = useBurgerMenu();
const {openAuthModal} = useAuthModal();
const {logout} = useAuth()

const authUser = useAuthUser();
const {variant = 'dark'} = defineProps<{
        variant?: MenuVariants;
}>();

const {searchData} = useSearch()
const color = computed(() => (variant === "light" ? "#fff" : "#333D46"));

</script>
