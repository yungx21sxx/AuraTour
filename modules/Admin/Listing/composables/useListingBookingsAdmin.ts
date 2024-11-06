import {mdiCalendarMonthOutline, mdiClockOutline, mdiCheckCircle, mdiCancel, mdiCheckCircleOutline, mdiHelpCircle, mdiPencil} from '@mdi/js'

export default () => {
    function getStatusText(status: string) {
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

    function getStatusIcon(status: string) {
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

    function getStatusColor(status: string) {
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
}