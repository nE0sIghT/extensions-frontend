/* global globalThis */
import require from '../require-compat'

import * as constants from '../constants'

import { versionCompare } from './common'

// @ts-ignore
window.require = require;

const SUPPORTED_APIS = [5, 6];

/** @type {HandlerList} */
let onChangeHandlers = [];
/** @type {HandlerList} */
let onShellRestartHandlers = [];
/** @type {HandlerList} */
let onShellSettingChangedHandlers = [];

/** @typedef {(...args: any[]) => void} Handler */
/** @typedef {Array<Handler>} HandlerList */

/**
 * @param {HandlerList} handlers
 * @param {any[]} args
 */
function handleEvents(handlers, args) {
    handlers.forEach(handler => {
        handler.apply(null, args);
    });
}

export class API {
    /**
     * @param {typeof NativeIntegration} api
     */
    constructor(api) {
        this.nativeApi = api;

        this.disableUpdates = versionCompare(api.shellVersion, '3.36') >= 0;
    }

    /**
     * @param {NativeIntegration.LocalExtension} extension
     * @returns {boolean}
     */
    isEnabled(extension) {
        return extension.state == constants.ExtensionState.ENABLED;
    }

    /**
     * @param {NativeIntegration.LocalExtension} extension
     * @returns {boolean}
     */
    isDisabled(extension) {
        return extension.state == constants.ExtensionState.DISABLED;
    }

    /**
     * @param {NativeIntegration.LocalExtension} extension
     * @returns {boolean}
     */
    isSystem(extension) {
        return extension.type == constants.ExtensionType.SYSTEM;
    }

    /**
     * @param {NativeIntegration.LocalExtension} extension
     * @returns {boolean}
     */
    haveError(extension) {
        return extension.state == constants.ExtensionState.ERROR;
    }

    /**
     * @param {NativeIntegration.LocalExtension} extension
     * @returns {Promise<void>}
     */
    async installExtension(extension) {

        let update = extension.state && extension.state != constants.ExtensionState.UNINSTALLED;
        let system = extension.type == constants.ExtensionType.SYSTEM;
        let disabled = this.isDisabled(extension);

        if (!system && update) {
            if (this.disableUpdates) {
                return;
            }

            extension.busy = extension.inUpdate = true;
            if (!await this.nativeApi.uninstallExtension(extension.uuid)) {
                extension.busy = extension.inUpdate = false;
                console.log(`Unable to uninstall extension ${extension.uuid}`);
                return;
            }
        }

        extension.busy = true;

        if (system) {
            if (!await this.nativeApi.setExtensionEnabled(extension.uuid, false)) {
                console.log(`Unable to disable extension ${extension.uuid}`);
                extension.busy = false;
                return;
            }
        }

        let result = await this.nativeApi.installExtension(extension.uuid);
        if (['s', 'successful'].includes(result)) {
            if (disabled) {
                await this.nativeApi.setExtensionEnabled(extension.uuid, false);
            }
        }

        Object.assign(extension, await this.nativeApi.getExtensionInfo(extension.uuid));
        extension.busy = extension.inUpdate = false;
    }

    /**
     * @param {NativeIntegration.LocalExtension} extension
     * @returns {Promise<void>}
     */
    async uninstallExtension(extension) {
        if (this.isSystem(extension)) {
            return;
        }

        return this.nativeApi.uninstallExtension(extension.uuid).then();
    }

    /**
     * @param {{ hasPrefs: any; uuid: any; }} extension
     * @returns {Promise<void>}
     */
    async openPreferences(extension) {
        if (extension.hasPrefs) {
            return this.nativeApi.launchExtensionPrefs(extension.uuid);
        }
    }

    /**
     * @param {Handler} handler
     */
    addOnChangeHandler(handler) {
        if (!onChangeHandlers.includes(handler)) {
            onChangeHandlers.push(handler);
        }
    }
    /**
     * @param {Handler} handler
     */
    addOnShellRestartHandler(handler) {
        if (!onShellRestartHandlers.includes(handler)) {
            onShellRestartHandlers.push(handler);
        }
    }
    /**
     * @param {Handler} handler
     */
    addOnShellSettingChangedHandler(handler) {
        if (!onShellSettingChangedHandlers.includes(handler)) {
            onShellSettingChangedHandlers.push(handler);
        }
    }
}

export async function initialize() {
    if (globalThis.SweetTooth) {
        const SweetTooth = globalThis.SweetTooth;

        try {
            let nativeApi = await SweetTooth.initialize().then(() => {
                if (SweetTooth.apiVersion && SUPPORTED_APIS.includes(SweetTooth.apiVersion)) {
                    SweetTooth.onchange = function () {
                        handleEvents(onChangeHandlers, Array.from(arguments));
                    };
                    SweetTooth.onshellrestart = function () {
                        handleEvents(onShellRestartHandlers, Array.from(arguments));
                    };
                    SweetTooth.onShellSettingChanged = function () {
                        handleEvents(onShellSettingChangedHandlers, Array.from(arguments));
                    };
    
                    return SweetTooth;
                }
    
                return null;
            });
            if (!nativeApi) {
                throw new Error(`Outdated and unsupported native integration detected.`);
            }

            return new API(nativeApi);
        } catch (error) {
            console.error(error.message);
        }
    }

    throw new Error(`Unable to initialize or access native integration.`);
    
}