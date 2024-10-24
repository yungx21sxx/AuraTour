export type TAuthSteps = 'AUTH-PENDING' | 'CONFIRM-CODE';
export type TAuthTypes = 'REGISTRATION' | 'LOGIN';

export interface IAuthStep {
    step: TAuthSteps;
    authType: TAuthTypes;
    email: string | null;
}

