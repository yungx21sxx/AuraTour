export interface VerifyAuthDTO {
    email: string;
    code: string
}

export interface LoginDTO {
    email: string;
}

export interface RegistrationDTO {
    email: string;
    name: string;
    surname: string;
    phone?: string;
    role: 'TOURIST' | 'LANDLORD'
}