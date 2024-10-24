import {useAuthUser} from "./useAuthUser";
import type {AdminLoginDTO, UserLoginDTO} from "~/types/dto.types";
import type {UserAuthResponse, UserResponse} from "~/types/response.types";
import {use} from "h3";
import {AuthAPI} from "~/modules/Auth/api/auth.api";
import type {IAuthUser} from "~/modules/Auth/types/user.types";

export const useAuth = () => {
    const authUser = useAuthUser();

    const setAuthUser = (user: IAuthUser | null) => {
        authUser.value = user;
    };

    const setCookie = (cookie: any) => {
        cookie.value = cookie;
    };


    const logout = async () => {
        await AuthAPI.logout()
        setUser(null);
    };

    const fetchProfile = async () => {
        try {
            const data = await AuthAPI.fetchProfile();
            if (data) {
                console.log(data)
                setAuthUser(data);
            }
        } catch (error) {
            setAuthUser(null);
        }
    };

    return {
        logout,
        fetchProfile,
        setAuthUser
    };
};
