import type {IAuthStep} from "~/modules/Auth/types/auth.types";

export default () => {

    const authStep = useState<IAuthStep>(() => ({
        step: 'AUTH-PENDING',
        authType: 'LOGIN',
        email: null,
    } as IAuthStep))

    const updateAuthStep = (auth: IAuthStep) => {
        authStep.value = auth
    };

    const resetAuthStep = () => {
        updateAuthStep({
            step: 'AUTH-PENDING',
            authType: 'LOGIN',
            email: null,
        })
    }

    watch(authStep, () => {
        localStorage.setItem('authStep', JSON.stringify(authStep.value));
    })

    onMounted(() => {
        const authStepCacheJSON = localStorage.getItem('authStep')
        if (!authStepCacheJSON) return;

        const authStepCache = JSON.parse(authStepCacheJSON)
        if (!authStepCache) return;

         updateAuthStep(
             authStepCache
         );
    })

    return {
        authStep,
        updateAuthStep,
        resetAuthStep
    }
}