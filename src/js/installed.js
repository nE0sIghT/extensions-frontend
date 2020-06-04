import constants from './constants'
import browserMixin from './mixins/browser'
import serverMixin from './mixins/server'
import ExtensionsList from '../components/ExtensionsList'

export default {
    mixins: [browserMixin, serverMixin],
    components: {
        ExtensionsList
    },

    data() {
        return {
            api: {
                server: false,
            },
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
                return this.api.browser.then(api => {
                    return api.getExtensionInfo(uuid).then(extension => {
                        this.$set(this.extensions.installed, uuid, extension);
                        return this.onExtensionStateChange(uuid, state);
                    });
                });
            }

            this.extensions.installed[uuid].state = state;
        },
    },

    created() {
        return this.api.browser.then(api => {
            return api.listExtensions().then(installed => {
                this.extensions.installed = installed;

                return this.api.server.extensions({
                    params: {
                        uuid: Object.keys(this.extensions.installed)
                    }
                }).then(({ data: { results } }) => {
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
                        return this.api.server.updates(request, api.shellVersion, api.versionValidationEnabled).then(({ data: results }) => {
                            for (let [uuid, update] of Object.entries(results)) {
                                this.$set(this.extensions.installed[uuid], 'update', update);
                            }
                        });
                    }
                });
            });
        });
    }
};
