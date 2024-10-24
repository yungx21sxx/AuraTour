import {useAuthUser} from "~/modules/auth/composables/useAuthUser";

export default defineNuxtRouteMiddleware(async () => {
    const user = useAuthUser();

    if (!user.value) return navigateTo({ name: "index" });
});
