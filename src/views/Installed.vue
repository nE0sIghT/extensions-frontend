<template>
    <b-container b-fluid='md'>
        <b-alert :show="browserError" variant="warning">
          There were errors from browser extension:
          {{ browserError}}
        </b-alert>
        <extensions-list
            v-if="$browserApi"
            :extensions="installedExtensions"
            show-controls
        ></extensions-list>
        <b-alert v-else show variant="warning">
            Browser extension was not found.
        </b-alert>
    </b-container>    
</template>

<script>
import constants from './constants'
import ExtensionsList from '../components/ExtensionsList'

export default {
    components: {
        ExtensionsList
    },

    data() {
        return {
            browserError: null,
            extensions: {
                installed: {}
            },

        };
    },

    computed: {
        installedExtensions() {
            let installed = this.extensions.installed;
            return installed && Object.values(installed)
                .sort((a, b) => a.name.localeCompare(b.name));
        }
    },

    methods: {
        onExtensionStateChange(uuid, state) {
            if(state == constants.ExtensionState.UNINSTALLED)
            {
                if(this.extensions.installed[uuid])
                {
                    if(this.extensions.installed[uuid].inUpdate)
                    {
                        this.extensions.installed[uuid].state = state;
                    }
                    else
                    {
                        this.$delete(this.extensions.installed, uuid);
                    }
                }
                return;
            }

            if(!this.extensions.installed[uuid]) {
                return this.$browserApi.then(api => {
                    return api.getExtensionInfo(uuid).then(extension => {
                        this.$set(this.extensions.installed, uuid, extension);
                        return this.onExtensionStateChange(uuid, state);
                    });
                });
            }

            this.extensions.installed[uuid].state = state;
        },

        onShellRestart() {
            console.log(arguments)
        },

        onShellSettingChanged() {
            console.log(arguments)
        },
    },

    created() {
        this.$browserApi.then(api => {
            this.$sweettoothEvents.$on(constants.BROWSER_EVENT.CHANGE, this.onExtensionStateChange);
            this.$sweettoothEvents.$on(constants.BROWSER_EVENT.SHELL_RESTART, this.onShellRestart);
            this.$sweettoothEvents.$on(constants.BROWSER_EVENT.SHELL_SETTING_CHANGES, this.onShellSettingChanged);

            return api.listExtensions().then(installed => {
                this.extensions.installed = installed;

                return this.$serverApiFp.v1ExtensionsList(Object.keys(this.extensions.installed)).then(({ data: { results } }) => {
                    let request = {};
                    results.forEach(extension => {
                        this.extensions.installed[extension.uuid] = Object.assign({}, this.extensions.installed[extension.uuid], extension);

                        if(!this.extensions.installed[extension.uuid].hasUpdate)
                        {
                            request[extension.uuid] = this.extensions.installed[extension.uuid].version;
                        }
                    });

                    if(!this.disableUpdates)
                    {
                        return this.$serverApiFp.v1ExtensionsUpdatesCreate({
                            installed: request,
                            shell_version: api.shellVersion,
                            version_validation_enabled: api.versionValidationEnabled
                        }).then(({ data: results }) => {
                            for (let [uuid, update] of Object.entries(results)) {
                                this.$set(this.extensions.installed[uuid], 'update', update);
                            }
                        });
                    }
                });
            });
        }).catch((error) => {
          this.$browserApi = false;
          this.browserError = error;
        });
    }
};
</script>
