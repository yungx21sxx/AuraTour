export function beautifyDate(dateInput: Date): string {
    const date = new Date(dateInput);
    const now = new Date();
    const dateFormatter = new Intl.DateTimeFormat('ru-RU', {
        month: 'short',
        day: 'numeric',
        year: now.getFullYear() === date.getFullYear() ? undefined : 'numeric',
    });
    return dateFormatter.format(date).replace('.', '');
}