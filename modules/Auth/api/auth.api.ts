import type {LoginDTO, RegistrationDTO, VerifyAuthDTO} from "~/modules/Auth/types/dto.types";
import type {IAuthUser} from "~/modules/Auth/types/user.types";
import type {TAuthTypes} from "~/modules/Auth/types/auth.types";

export class AuthAPI {
    static async verifyAuth(authType: TAuthTypes, dto: VerifyAuthDTO): Promise<IAuthUser> {
        const url = authType === 'LOGIN' ? '/api/auth/verify/login' : '/api/auth/verify/register';
        return $fetch(url, {
            method: 'POST',
            body: dto
        })
    }

    static async login(dto: LoginDTO) {
        return $fetch('/api/auth/login', {
            method: 'POST',
            body: dto
        })
    }

    static async registration(dto: RegistrationDTO){
        return $fetch('/api/auth/register', {
            method: 'POST',
            body: dto
        })
    }

    static async logout() {
        return $fetch('/api/auth/logout');
    }

    static async fetchProfile(): Promise<IAuthUser> {
        return $fetch("/api/auth/profile", {
            headers: useRequestHeaders(["cookie"]) as HeadersInit,
        })
    }
}


