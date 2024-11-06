import {mdiCancel, mdiCheckCircle, mdiCheckCircleOutline, mdiClockOutline, mdiHelpCircle} from "@mdi/js";

export function getStatusText(status: string) {
    switch (status) {
        case 'PENDING':
            return 'В ожидании';
        case 'CONFIRMED':
            return 'Подтверждено';
        case 'CANCELLED':
            return 'Отменено';
        case 'COMPLETED':
            return 'Завершено';
        default:
            return 'Неизвестно';
    }
}

export function getStatusIcon(status: string) {
    switch (status) {
        case 'PENDING':
            return mdiClockOutline;
        case 'CONFIRMED':
            return mdiCheckCircleOutline;
        case 'CANCELLED':
            return mdiCancel;
        case 'COMPLETED':
            return mdiCheckCircle;
        default:
            return mdiHelpCircle;
    }
}

export function getStatusColor(status: string) {
    switch (status) {
        case 'PENDING':
            return 'orange';
        case 'CONFIRMED':
            return 'green';
        case 'CANCELLED':
            return 'red';
        case 'COMPLETED':
            return 'blue';
        default:
            return 'grey';
    }
}

export function beautifyDates(dateInput: Date): string {
    const date = new Date(dateInput);
    const now = new Date();
    const dateFormatter = new Intl.DateTimeFormat('ru-RU', {
        month: 'short',
        day: 'numeric',
        year: now.getFullYear() === date.getFullYear() ? undefined : 'numeric',
    });
    return dateFormatter.format(date).replace('.', '');
}
