import {useAuthUser} from "~/modules/Auth/composables/useAuthUser";

export default defineNuxtRouteMiddleware(async () => {
    const user = useAuthUser();
    const roles: string[] = ['ADMIN', 'MANAGER'];

    const role = user.value?.role;
    if (!role || !roles.includes(role)) {
        return navigateTo({ name: "index" });
    }
});
