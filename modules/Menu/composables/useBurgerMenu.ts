export default () => {
    const burgerMenuIsOpen = useState<boolean>(() => false);
    const open = () => burgerMenuIsOpen.value = true;
    const close = () => burgerMenuIsOpen.value = false;

    return {
        burgerMenuIsOpen,
        close,
        open
    };
  }