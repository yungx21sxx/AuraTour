import type {UserAuthResponse} from "~/types/response.types";

export const useAuthUser = () => {
    return useState<UserAuthResponse | null>("user", () => null);
};
