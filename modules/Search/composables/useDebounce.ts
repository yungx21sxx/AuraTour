export function useDebounce() {
    const debounceTimer = ref<number | null>(null);

    function debounce<T extends (...args: any[]) => void>(fn: T, delay: number = 500): (...args: Parameters<T>) => void {
        return (...args: Parameters<T>) => {
            if (debounceTimer.value !== null) {
                clearTimeout(debounceTimer.value);
            }
            debounceTimer.value = window.setTimeout(() => {
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