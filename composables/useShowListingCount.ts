import {useAuthUser} from "~/modules/Auth/composables/useAuthUser";

export default () => {
	const user = useAuthUser();
	const roles = ['ADMIN' | 'MANAGER'];

	return user.value && roles.includes(user.value.role);
}