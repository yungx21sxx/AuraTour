import {useAuth} from "~/modules/Auth/composables/useAuth";

export default defineNuxtPlugin(async () => {
	const {fetchProfile} = useAuth();
	await fetchProfile();
});
