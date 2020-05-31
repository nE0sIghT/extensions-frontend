/* global SweetTooth */
import require from '../require-compat'
window.require = require;

const SUPPORTED_APIS = [5, 6];

let onChangeHandlers = [];
let onShellRestartHandlers = [];
let onShellSettingChangedHandlers = [];

function handleEvents(handlers, args) {
    handlers.forEach(handler => {
        handler.apply(null, args);
    });
}

const api = SweetTooth.initialize().then(() => {
    if (SweetTooth.apiVersion && SUPPORTED_APIS.includes(SweetTooth.apiVersion)) {
        SweetTooth.onchange = function () {
            handleEvents(onChangeHandlers, arguments);
        };
        SweetTooth.onshellrestart = function () {
            handleEvents(onShellRestartHandlers, arguments);
        };
        SweetTooth.onShellSettingChanged = function () {
            handleEvents(onShellSettingChangedHandlers, arguments);
        };

        return SweetTooth;
    }
}).catch((ex) => {
    console.log(ex);
    return Promise.reject(ex);
});

export default {
    api: api,

    addOnChangeHandler(handler) {
        if(!onChangeHandlers.includes(handler))
        {
            onChangeHandlers.push(handler);
        }
    },

    addOnShellRestartHandler(handler) {
        if(!onShellRestartHandlers.includes(handler))
        {
            onShellRestartHandlers.push(handler);
        }
    },

    addOnShellSettingChangedHandler(handler) {
        if(!onShellSettingChangedHandlers.includes(handler))
        {
            onShellSettingChangedHandlers.push(handler);
        }
    },
}
