import type {IAuthUser} from "~/modules/Auth/types/user.types";

export const useAuthUser = () => {
    return useState<IAuthUser | null>("user", () => null);
};
