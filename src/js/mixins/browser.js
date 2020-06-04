import browser from '../api/browser'
import common from './common'
import constants from '../constants'

export default {
    mixins: [common],

    data() {
        return {
            api: {
                browser: false,
            },
            disableUpdates: false,
        };
    },

    methods: {
        isEnabled(extension) {
            return extension.state == constants.ExtensionState.ENABLED;
        },

        isDisabled(extension) {
            return extension.state == constants.ExtensionState.DISABLED;
        },

        isSystem(extension) {
            return extension.type == constants.ExtensionType.SYSTEM;
        },

        haveError(extension) {
            return extension.state == constants.ExtensionState.ERROR;
        },

        async installExtension(extension) {
            let api = await this.api.browser;
            let update = extension.state && extension.state != constants.ExtensionState.UNINSTALLED;
            let system = extension.type == constants.ExtensionType.SYSTEM;
            let disabled = this.isDisabled(extension);

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
            let api = await this.api.browser;
            return api.uninstallExtension(extension.uuid);
        },

        async openPreferences(extension) {
            if(extension.hasPrefs)
            {
                let api = await this.api.browser;
                return api.launchExtensionPrefs(extension.uuid);
            }
        },

        onExtensionStateChange() {},
        onShellRestart() {},
        onShellSettingChanged() {},
    },

    created() {
        this.api.browser = browser.api.then((api) => {
            this.disableUpdates = this.versionCompare(api.shellVersion, '3.36') >= 0;

            browser.addOnChangeHandler(this.onExtensionStateChange);
            browser.addOnShellRestartHandler(this.onShellRestart);
            browser.addOnShellSettingChangedHandler(this.onShellSettingChanged);

            return api;
        }).catch((error) => {
            console.log(error);
            return Promise.reject(error);
        });
    }
};
