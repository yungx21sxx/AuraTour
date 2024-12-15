import {useAuthUser} from "~/modules/Auth/composables/useAuthUser";

export default defineNuxtRouteMiddleware(async () => {
    const user = useAuthUser();
    const roles: string[] = ['ADMIN', 'MANAGER'];

    if (!user.value &&
        !roles.includes(user.value?.role)
    ) {
        return navigateTo({ name: "index" });
    }
});
