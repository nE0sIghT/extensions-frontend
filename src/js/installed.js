import { computed, defineComponent, del, reactive, set, watch } from '@vue/composition-api';

import server from './api/server'

import BrowserAPI from '../components/BrowserAPI.vue';
import LocalExtensionsList from '../components/LocalExtensionsList.vue'

import { useBrowserAPI } from './compositions/browser';
import { ExtensionState } from './constants';

const Installed = defineComponent({
    components: {
        'browser-api': BrowserAPI,
        LocalExtensionsList
    },
    setup() {
        const { browser, onInitialize } = useBrowserAPI();

        onInitialize((api) => {
            api.addOnChangeHandler(onExtensionStateChange);
        });

        const state = reactive({
            /** @type {Record<string, NativeIntegration.LocalExtension>} */
            localExtensions: {}
        });

        /**
         * @param {string} uuid 
         * @param {ExtensionState} extensionState
         * @returns {void} 
         */
        function onExtensionStateChange(uuid, extensionState) {
            if (extensionState == ExtensionState.UNINSTALLED) {
                if (state.localExtensions[uuid]) {
                    if (state.localExtensions[uuid].inUpdate) {
                        state.localExtensions[uuid].state = extensionState;
                    }
                    else {
                        del(state.localExtensions, uuid);
                    }
                }
                return;
            }

            if (!state.localExtensions[uuid]) {
                browser.api?.nativeApi.getExtensionInfo(uuid).then(extension => {
                    set(state.localExtensions, uuid, extension);
                    return onExtensionStateChange(uuid, extensionState);
                });
            }

            state.localExtensions[uuid].state = extensionState;
        }

        watch(browser, ({ api }) => {
            if (!api) {
                return;
            }

            api.nativeApi.listExtensions().then(installed => {
                state.localExtensions = installed;

                return server.extensions({
                    params: {
                        uuid: Object.keys(state.localExtensions)
                    }
                }).then(({ data: { results } }) => {
                    /** @type {Record<string, number>} */
                    let request = {};
                    results.forEach(extension => {
                        const info = Object.assign({}, state.localExtensions[extension.uuid], extension);

                        state.localExtensions[extension.uuid] = info;

                        if (!info.hasUpdate) {
                            request[extension.uuid] = state.localExtensions[extension.uuid].version;
                        }
                    });

                    if (!api.disableUpdates) {
                        server.updates(request, api.nativeApi.shellVersion, api.nativeApi.versionValidationEnabled).then(({ data: results }) => {
                            for (let [uuid, update] of Object.entries(results)) {
                                state.localExtensions[uuid].update = update;
                            }
                        });
                    }
                });
            });
        });

        const installedExtensions = computed(() => {
            return Object.values(state.localExtensions).sort((a, b) => a.name.localeCompare(b.name));

        });

        return {
            installedExtensions
        };
    }
});

export default Installed;