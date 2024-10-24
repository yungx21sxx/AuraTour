<template>
    <nav class="nav">
        <div class="wrapper nav__body">
            <MainLogo class="nav__logo" :variant="variant" />
            <div class="nav__links">
                <v-menu open-on-hover transition="scale-transition">
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
                    <v-card min-width="300">
                        <v-card-item>
	                       
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
            >
                <BurgerIcon :variant="props.variant" />
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
    @media screen and (max-width: 700px) {
        &__right,
        &__cities {
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
}
</style>

<script setup lang="ts">
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

const { open } = useBurgerMenu();
const {openAuthModal} = useAuthModal();

const authUser = useAuthUser();
console.log(authUser.value)
const props = withDefaults(
    defineProps<{
        variant?: MenuVariants;
    }>(),
    {
        variant: "dark",
    },
);


const color = computed(() => (props.variant === "light" ? "#fff" : "#333D46"));

const popularCities = [
	{
		name: 'Гагры',
		href: ''
	}
]
</script>
