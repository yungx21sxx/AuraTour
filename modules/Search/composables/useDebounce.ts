export function useDebounce() {
    const debounceTimer = ref(null);

    function debounce(fn, delay = 500) {
        return function (...args) {
            if (debounceTimer.value) {
                clearTimeout(debounceTimer.value);
            }
            debounceTimer.value = setTimeout(() => {
                fn(...args);
                debounceTimer.value = null;
            }, delay);
        };
    }

    onBeforeUnmount(() => {
        if (debounceTimer.value) {
            clearTimeout(debounceTimer.value);
        }
    });

    return {
        debounce,
    };
}