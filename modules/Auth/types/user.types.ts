export type TUserRoles = 'ADMIN' | 'MANAGER' | 'TOURIST' | 'LANDLORD'

export interface IAuthUser {
    id: number;
    name: string;
    surname: string | null;
    email: string;
    phone: string;
    role: TUserRoles;
    bonusPoints: number;
}