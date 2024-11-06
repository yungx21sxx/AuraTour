<template>
    <nav class="nav">
        <div class="wrapper nav__body">
	        <NuxtLink to="/" external style=" width: fit-content; display: flex; flex-direction: column; justify-content: center ">
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
	                        <h4 class="mt-2 mb-2">Популярные направления</h4>
	                        <v-chip-group column color="#7059FF">
		                        <v-chip
			                        v-for="city of searchData.cities.slice(0,8)"
			                        :key="city.id"
			                        color="#7059FF"
			                        :href="`/search/city/${city.slug}`"
		                        >{{city.cityName}}</v-chip>
	                        </v-chip-group>
	                        <h4 class="mt-4 mb-2">Типы жилья</h4>
	                        <v-chip-group column color="#7059FF">
		                        <v-chip
			                        v-for="type of searchData.listingTypes.slice(0,5)"
			                        :key="type.id"
			                        color="#7059FF"
			                        :href="`/search/type/${type.slug}`"
		                        >{{type.name}}</v-chip>
	                        </v-chip-group>
                        </v-card-item>
                    </v-card>
                </v-menu>
                <v-btn
                    class="nav__link"
                    :color="color"
                    variant="text"
                    href="/about"
                    >О нас</v-btn
                >
                <v-btn
                    class="nav__link"
                    :color="color"
                    variant="text"
                    href="/about"
                    >Помощь</v-btn
                >
            </div>
            <div class="nav__right">
	            <v-btn
		            class="nav__cities"
		            variant="text"
		            :prepend-icon="mdiHeartOutline"
		            :color="color"
		            href="/favorites"
	            >
		            Избранное
	            </v-btn>
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
							           <v-avatar v-if="authUser.avatar" :src="authUser.avatar"/>
							           <v-avatar v-else color="#7059FF">{{authUser.name[0]}}</v-avatar>
						           </template>
					           </v-list-item>
				           </v-list>
				            <v-divider></v-divider>
				            <v-list>
					            <v-list-item>
						            <BtnPrimary
							            :prepend-icon="mdiAccountCircleOutline"
							            v-if="['TOURIST', 'LANDLORD'].includes(authUser.role)"
							            href="/admin/bookings"
							            block
						            >Личный кабинет</BtnPrimary>
						            <BtnPrimary
							            :prepend-icon="mdiAccountCircleOutline"
							            v-else
							            block
						            >Админка</BtnPrimary>
					            </v-list-item>
					            <v-list-item>
						            <BtnSecondary block :prepend-icon="mdiHomeVariantOutline">Мои объекты</BtnSecondary>
					            </v-list-item>
					            <v-list-item>
						            <BtnSecondary block :prepend-icon="mdiLogout">Выйти</BtnSecondary>
					            </v-list-item>
				            </v-list>
				        
			            </v-card-item>
		            </v-card>
	            </v-menu>
                <BtnPrimary class="nav__btn">Сдать жилье</BtnPrimary>
            </div>
            <v-btn
                icon
                density="comfortable"
                variant="text"
                class="nav__burger"
                @click="open"
            >
                <BurgerIcon :variant="props.variant"/>
            </v-btn>
        </div>
    </nav>
</template>

<style lang="scss" scoped>
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
        width: fit-content;
    }
    &__links {
        margin-left: 16px;
    }
    &__right {
        margin-left: auto;
    }
    &__btn {
        margin-left: 10px;
    }

    @media screen and (max-width: 900px) {
        &__link {
            display: none;
        }
	    
    }
    @media screen and (max-width: 730px) {
        &__right {
            display: none;
        }
        &__logo {
            height: 22px;
            width: fit-content;
        }
        &__burger {
            display: block;
            margin-left: auto;
            margin-right: -8px;
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


const { open } = useBurgerMenu();
const {openAuthModal} = useAuthModal();

const authUser = useAuthUser();
const props = withDefaults(
    defineProps<{
        variant?: MenuVariants;
    }>(),
    {
        variant: "dark",
    },
);

const {searchData} = useSearch()
const color = computed(() => (props.variant === "light" ? "#fff" : "#333D46"));



</script>
