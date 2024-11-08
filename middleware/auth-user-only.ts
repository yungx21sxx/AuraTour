import {useAuthUser} from "~/modules/Auth/composables/useAuthUser";

export default defineNuxtRouteMiddleware(async () => {
    const user = useAuthUser();

    if (!user.value) return navigateTo({ name: "index" });
});
