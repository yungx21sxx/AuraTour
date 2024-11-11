<script setup lang="ts">
import BookingMainForm from "~/modules/Booking/components/BookingMainForm.vue";
import { mdiArrowRight } from "@mdi/js";
import MenuMain from "~/modules/Menu/components/MenuMain.vue";
import useSearch from "~/modules/Booking/composables/useSearch";
import BonusProgramModal from "~/modules/Common/BonusProgramModal.vue";

const {searchData} = useSearch();

const bonusProgramInfo = ref(false);
</script>

<template>
	
	
    <div
        class="banner"
    >
        <div class="banner__body">
            <MenuMain variant="light" class="banner__menu" />
            <div class="banner__wrapper wrapper">
                <h1 class="banner__title">
                    Жилье в Абхазии <br />
                    посуточно
                </h1>
                <div class="banner__info" >
                    <p>Вернем до 5% от суммы броинрования</p>
                    <button @click="bonusProgramInfo = true">
                        Подробнее
                        <v-icon :icon="mdiArrowRight" size="24" />
                    </button>
                </div>
                <BookingMainForm />
                <div class="banner__cities">
                    <v-chip-group show-arrow>
                        <div
                            style="
                                display: flex;
                                align-items: center;
                                margin-right: 10px;
                            "
                        >
                            Например
                        </div>
                       <v-chip
	                       v-for="city of searchData.cities.slice(0,6)"
	                       variant="outlined"
	                       :key="city.id"
	                       :href="`/search/city/${city.slug}`"
                       >{{city.cityName}}</v-chip>
                    </v-chip-group>
                </div>
            </div>
        </div>
    </div>
	<BonusProgramModal v-model="bonusProgramInfo"/>
</template>

<style lang="scss" scoped>
.banner {
    height: 650px;
	background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.1)),
		url("/main-page/banner.jpg");
	background-size: cover;
	background-position: center;
    &__menu {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
    }

    &__title {
        font-size: 42px;
        color: #ffffff;
        /* line-height: 56px; */
        font-weight: 600;
        margin-bottom: 20px;
    }

    &__info {
        border-left: 3px solid $accent-orange;
        padding: 4px 0 4px 12px;
        margin-bottom: 32px;

        p {
            font-size: 20px;
            color: #fff;
            margin-bottom: 8px;
        }

        button {
            color: $accent-orange;
        }
    }
    &__body {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    &__cities {
        color: white;
        margin-top: 24px;
    }

    @media screen and (max-width: 750px) {
        height: 100svh;
        &__title {
            font-size: 30px;
            margin-bottom: 16px;
        }

        &__info {
            padding: 2px 0 2px 8px;
            p {
                font-size: 16px;
                margin-bottom: 4px;
            }
        }
    }
	
	@media screen and (max-height: 620px){
		padding: 64px 0;
		height: auto;
	}
}
</style>
