import {IAuthStep} from "~/modules/Auth/types/auth.types";

export default () => {

    const authStep = useState<IAuthStep>(() => ({
        step: 'CONFIRM-CODE',
        authType: 'LOGIN',
        email: 'yungx21sxx@gmail.com',
    } as IAuthStep))

    const updateAuthStep = (auth: IAuthStep) => {
        authStep.value = auth
    }

    watch(authStep, () => {
        localStorage.setItem('authStep', JSON.stringify(authStep.value));
    })

    onMounted(() => {
        const authStepCache = JSON.parse(localStorage.getItem('authStep'))
        if (!authStepCache) return;

         updateAuthStep(
             authStepCache
         );
    })

    return {
        authStep,
        updateAuthStep
    }
}