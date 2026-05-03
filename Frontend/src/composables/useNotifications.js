import { Notify } from "quasar"

export function useNotifications() {

    const success = (message, caption = '') => {
        Notify.create({
            message: message,
            caption: caption,
            position: 'top',
            timeout: 3000,
            icon: 'check_circle',
            color: 'white',
            textColor: 'positive',
            iconColor: 'positive',
            classes: 'success-notification',
            actions: [{
                icon: 'close',
                color: 'positive',
                flat: true
            }],
            html: true
        })
    }

    const error = (message, caption = '') => {
        Notify.create({
            message: message,
            caption: caption,
            position: 'top',
            timeout: 4000,
            icon: 'error',
            color: 'white',
            textColor: 'negative',
            iconColor: 'negative',
            classes: 'error-notification',
            actions: [{
                icon: 'close',
                color: 'negative',
                flat: true
            }],
            html: true
        })
    }

    const warning = (message, caption = '') => {
        Notify.create({
            message: message,
            caption: caption,
            position: 'top',
            timeout: 3500,
            icon: 'warning',
            color: 'white',
            textColor: 'warning',
            iconColor: 'warning',
            classes: 'warning-notification',
            actions: [{
                icon: 'close',
                color: 'warning',
                flat: true
            }],
            html: true
        })
    }

    const info = (message, caption = '') => {
        Notify.create({
            message: message,
            caption: caption,
            position: 'top',
            timeout: 3000,
            icon: 'info',
            color: 'white',
            textColor: 'info',
            iconColor: 'info',
            classes: 'info-notification',
            actions: [{
                icon: 'close',
                color: 'info',
                flat: true
            }],
            html: true
        })
    }

    return { success, error, warning, info }
}