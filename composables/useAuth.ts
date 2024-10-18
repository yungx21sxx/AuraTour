import {useAuthUser} from "./useAuthUser";
import type {AdminLoginDTO, UserLoginDTO} from "~/types/dto.types";
import type {UserAuthResponse, UserResponse} from "~/types/response.types";
import {use} from "h3";

export const useAuth = () => {
	const authUser = useAuthUser();

	const setUser = (user: UserAuthResponse | null) => {
		authUser.value = user;
	};



	const setCookie = (cookie: any) => {
		cookie.value = cookie;
	};


	const logout = async () => {
		const data = await $fetch("/api/auth/logout", {
			method: "GET",
		});

		setUser(null);
	};

	const getUserInfo = async () => {
		if (!authUser.value) {
			try {
				const data = await $fetch("/api/auth/profile", {
					headers: useRequestHeaders(["cookie"]) as HeadersInit,
				});
				setUser(data);
			} catch (error) {
				setCookie(null);
			}
		}

		return authUser;
	};

	return {
		login,
		logout,
		me,
		getUserById,
		setUser,
		authModalIsOpen
	};
};
