<script setup lang="ts">
import BookingMainForm from "~/modules/Booking/components/BookingMainForm.vue";
import { mdiArrowRight } from "@mdi/js";
import MenuMain from "~/modules/Menu/components/MenuMain.vue";
import useSearch from "~/modules/Booking/composables/useSearch";

const {searchData} = useSearch();
</script>

<template>
    <v-img
        src="/main-page/banner.jpg"
        class="banner"
        alt="Аура Тур"
        gradient="to bottom, rgba(0,0,0,.3), rgba(0,0,0,.1)"
        cover
    >
        <!--		<template #sources>-->
        <!--			<source media="(max-width: 750px)" srcset="/main-page/banner-mobile1.webp">-->
        <!--			&lt;!&ndash; Для ПК &ndash;&gt;-->
        <!--			<source media="(min-width: 751px)" srcset="/main-page/banner-desktop1.webp">-->
        <!--		-->
        <!--		-->
        <!--		</template>-->
        <div class="banner__body">
            <MenuMain variant="light" class="banner__menu" />
            <div class="banner__wrapper wrapper">
                <h1 class="banner__title">
                    Жилье в Абхазии <br />
                    посуточно
                </h1>
                <div class="banner__info">
                    <p>Вернем <strong>10%</strong> от стомости бронирования</p>
                    <button>
                        Узнать подробности
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
    </v-img>
</template>

<style lang="scss" scoped>
.banner {
    height: 650px;
    &__menu {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
    }

    &__title {
        font-size: 36px;
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
            font-size: 32px;
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
}
</style>
