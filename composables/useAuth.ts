import {useAuthUser} from "./useAuthUser";
import type {AdminLoginDTO, UserLoginDTO} from "~/types/dto.types";
import type {UserAuthResponse, UserResponse} from "~/types/response.types";
import {use} from "h3";

export const useAuth = () => {
	const authUser = useAuthUser();

	const setUser = (user: UserAuthResponse | null) => {
		authUser.value = user;
	};


	const authModalIsOpen = useState(() => false)

	const getUserById = async (userId: number) => {
		try {
			const user = await $fetch(`/api/user/${userId}`)
			return user;
		} catch (e: any) {
			throw new Error(e.message)
		}
	}

	const setCookie = (cookie: any) => {
		cookie.value = cookie;
	};

	const login = async (
		dto: UserLoginDTO | AdminLoginDTO,
		role: 'ADMIN' | 'USER'
	): Promise<UserAuthResponse | null> => {

		const user = await $fetch(
			role === 'ADMIN' ? '/api/admin/login' : '/api/user/login',
			{
				method: "POST",
				body: dto,
			}
			);
		//@ts-ignore
		setUser(user);
		return authUser.value;
	};

	const logout = async () => {
		const data = await $fetch("/api/auth/logout", {
			method: "GET",
		});

		setUser(null);
	};

	const me = async () => {
		if (!authUser.value) {
			try {
				const data = await $fetch("/api/auth/me", {
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
