import {useAuthUser} from "~/modules/auth/composables/useAuthUser";

export default defineNuxtRouteMiddleware(async () => {
    const user = useAuthUser();
    const roles = ['ADMIN' | 'MANAGER'];

    if (!user.value &&
        !roles.includes(user.value.role)
    ) {
        return navigateTo({ name: "index" });
    }
});
