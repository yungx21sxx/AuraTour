
export function useDebounce<T extends (...args: any[]) => void>(fn: T, delay = 500) {
    let debounceTimer = ref<number | null>(null);

    return (...args: Parameters<T>) => {
        if (debounceTimer.value) {
            clearTimeout(debounceTimer.value);
        }
        debounceTimer.value = setTimeout(() => {
            fn(...args);
            debounceTimer.value = null;
        }, delay);
    };
}