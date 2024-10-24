export default () =>{
    const authModalIsOpen = useState<boolean>(() => false)
    const closeAuthModal = () => authModalIsOpen.value = false;
    const openAuthModal = () => authModalIsOpen.value = true;

    return {
        authModalIsOpen,
        closeAuthModal,
        openAuthModal
    }
}