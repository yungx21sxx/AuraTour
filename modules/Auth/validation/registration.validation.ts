import { useField, useForm } from 'vee-validate'

const { handleSubmit, handleReset } = useForm({
    validationSchema: {
        name (value) {
            if (value?.length >= 2) return true

            return 'Введите имя.'
        },
        surname (value) {
            if (value?.length >= 2) return true

            return 'Введите фамилию.'
        },
        phone (value) {
            if (/^[0-9-]{7,}$/.test(value)) return true

            return 'Введите номер телефона.'
        },
        email (value) {
            if (/^[a-z.-]+@[a-z.-]+\.[a-z]+$/i.test(value)) return true

            return 'Введите почту.'
        },

    },
})