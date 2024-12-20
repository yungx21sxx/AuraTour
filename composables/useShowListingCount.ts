import {useAuthUser} from "~/modules/Auth/composables/useAuthUser";

export default () => {
	const user = useAuthUser();
	const roles: string[] = ['ADMIN', 'MANAGER'];

	if (!user.value) {
		return false;
	}

	return roles.includes(user.value.role);
}