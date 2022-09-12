/* global SweetTooth */
import constants from '../js/constants'
import client from '../js/api/extensions-web-client'
import require from '../js/require-compat'
import Vue from 'vue';

window.require = require;

const SUPPORTED_APIS = [5, 6];
const PRERELEASE_VERSIONS = {
    'alpha': -3,
    'beta': -2,
    'rc': -1,
};
const EVENT_BUS = new Vue();
const API = (() => {
    if(typeof(SweetTooth) == 'undefined')
    {
        return Promise.reject();
    }

    return SweetTooth.initialize().then(() => {
        if (SweetTooth.apiVersion && SUPPORTED_APIS.includes(SweetTooth.apiVersion)) {
            SweetTooth.onchange = (...args) => {
                EVENT_BUS.$emit(constants.BROWSER_EVENT.CHANGE, ...args);
            };
            SweetTooth.onshellrestart = (...args) => {
                EVENT_BUS.$emit(constants.BROWSER_EVENT.SHELL_RESTART, ...args);
            };
            SweetTooth.onShellSettingChanged = (...args) => {
                EVENT_BUS.$emit(constants.BROWSER_EVENT.SHELL_SETTING_CHANGES, ...args);
            };

            return SweetTooth;
        }
    }).catch((ex) => {
        console.log(ex);
        return Promise.reject(ex);
    });
})();

function parseGNOMEVersion(value) {
    if(Object.keys(PRERELEASE_VERSIONS).includes(value)) {
        return PRERELEASE_VERSIONS[value];
    }

    return parseInt(value);
}

function isDisabled(extension) {
    return extension.state == constants.ExtensionState.DISABLED;
}

function versionCompare(a, b) {
    a = a.split(".").map(parseGNOMEVersion);
    b = b.split(".").map(parseGNOMEVersion);

    for(let i = 0; i < Math.max(a.length, b.length); i++) {
        if(typeof(a[i]) == 'undefined' || typeof(b[i]) == 'undefined')
        {
            return typeof(a[i]) == 'undefined' && -1 || 1;
        }
        else if(a[i] !== b[i]) {
            return a[i] - b[i];
        }
    }

    return 0;
}

export default {
    install(app) {
        app.prototype.$browserApi = API;
        app.prototype.$serverApi = client.api;
        app.prototype.$serverApiFp = client.apiFp;
        app.prototype.$sweettoothEvents = EVENT_BUS;

        app.mixin({
            data() {
                return {
                    disableUpdates: false,
                    integrationReady: false,
                }
            },

            methods: {
                setToken(token, remember = false) {
                    let storage = remember && localStorage || sessionStorage;
                    storage.setItem('token', token.token);
                    storage.setItem('tokenExpiry', token.expiry);
                    client.setToken(token.token);
                    this.$sweettoothEvents.$emit(constants.TOKEN_SET_EVENT);
                },

                restoreToken() {
                    let now = new Date();
                    for (let storage of [localStorage, sessionStorage]) {
                        let token = storage.getItem('token');
                        let expiry = storage.getItem('tokenExpiry');
                        if (token && expiry && now < new Date(expiry)) {
                            client.setToken(token);
                            break;
                        }
                    }
                },

                removeToken() {
                    for (let storage of [localStorage, sessionStorage]) {
                        storage.removeItem('token');
                        storage.removeItem('tokenExpiry');
                    }
                    client.setToken(null);
                },

                getValidationState({ dirty, validated, valid = null }) {
                    return dirty || validated ? valid : null;
                },

                getExtensionIcon(extension) {
                    return extension.icon || '/images/plugin.png';
                },

                isExtensionEnabled(extension) {
                    return extension.state == constants.ExtensionState.ENABLED;
                },

                isExtensionStateError(extension) {
                    return extension.state == constants.ExtensionState.ERROR;
                },

                isSystemExtension(extension) {
                    return extension.type == constants.ExtensionType.SYSTEM;
                },

                async installExtension(extension) {
                    let api = await this.$browserApi;
                    let update = extension.state && extension.state != constants.ExtensionState.UNINSTALLED;
                    let system = extension.type == constants.ExtensionType.SYSTEM;
                    let disabled = isDisabled(extension);

                    if(!system && update)
                    {
                        if(this.disableUpdates)
                        {
                            return;
                        }

                        extension.busy = extension.inUpdate = true;
                        if(!await api.uninstallExtension(extension.uuid))
                        {
                            extension.busy = extension.inUpdate = false;
                            console.log(`Unable to uninstall extension ${extension.uuid}`);
                            return;
                        }
                    }

                    extension.busy = true;

                    if(system)
                    {
                        if(!await api.setExtensionEnabled(extension.uuid, false))
                        {
                            console.log(`Unable to disable extension ${extension.uuid}`);
                            extension.busy = false;
                            return;
                        }
                    }

                    let result = await api.installExtension(extension.uuid);
                    if (['s', 'successful'].includes(result))
                    {
                        if(disabled)
                        {
                            await api.setExtensionEnabled(extension.uuid, false);
                        }
                    }

                    Object.assign(extension, await api.getExtensionInfo(extension.uuid));
                    extension.busy = extension.inUpdate = false;
                },

                async uninstallExtension(extension) {
                    if(this.isSystemExtension(extension))
                    {
                        return;
                    }

                    let api = await this.$browserApi;
                    return api.uninstallExtension(extension.uuid);
                },

                async openPreferences(extension) {
                    if(extension.hasPrefs)
                    {
                        let api = await this.$browserApi;
                        return api.launchExtensionPrefs(extension.uuid);
                    }
                },
            },

            created() {
                this.restoreToken();
                this.$browserApi.then((api) => {
                    this.disableUpdates = versionCompare(api.shellVersion, '3.36') >= 0;
                    this.integrationReady = true;

                    return api;
                }).catch((error) => {
                    return Promise.reject(error);
                });
            }
        });
    }
}
