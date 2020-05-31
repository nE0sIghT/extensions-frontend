import browser from '../api/browser'
import constants from '../constants'

export default {
    data() {
        return {
            api: {
                browser: false,
            },
        };
    },

    methods: {
        isEnabled(extension) {
            return extension.state == constants.ExtensionState.ENABLED;
        },

        isDisabledState(state) {
            return [
                constants.ExtensionState.DISABLED,
                constants.ExtensionState.INITIALIZED,
            ].includes(state);
        },

        isSystem(extension) {
            return extension.type == constants.ExtensionType.SYSTEM;
        },

        async openPreferences(extension) {
            if(extension.hasPrefs)
            {
                let api = await this.api.browser;
                return api.launchExtensionPrefs(extension.uuid);
            }
        },

        async deleteExtension(extension) {
            let api = await this.api.browser;
            return api.uninstallExtension(extension.uuid);
        },

        onExtensionStateChange() {},
        onShellRestart() {},
        onShellSettingChanged() {},
    },

    created() {
        this.api.browser = browser.api.then((api) => {
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
