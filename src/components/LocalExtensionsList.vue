<template>
    <div class='extensions-list'>
        <div
            v-for="extension in extensions"
            :key="extension.id"
            class='extension-row d-flex flex-column'
        >
            <b-overlay
                :show="extension.busy"
                rounded
                opacity="0.6"
                spinner-variant="primary"
                no-fade
            >
                <div
                    v-if="api"
                    class='extension-row-header'
                >
                    <h3 class='m-0'>
                        <b-link :to="`/extension/${extension.id}`">
                            <img
                                :src='getExtensionIcon(extension)'
                                alt="Extension Icon"
                            />{{ extension.name }}
                        </b-link>
                    </h3>
                    <div class='status-icons'>
                        <b-icon
                            v-if="api.isSystem(extension)"
                            v-b-popover.hover="$t('This extension is installed systemwide')"
                            icon="lock-fill"
                            :class="getIconClasses('bg-primary')"
                            aria-hidden="true"
                        ></b-icon>
                        <b-icon
                            v-if="extension.hasUpdate"
                            v-b-popover.hover="$t('Update will be applied on next Shell restart')"
                            icon="cloud-download"
                            :class="getIconClasses('bg-success')"
                            aria-hidden="true"
                        ></b-icon>
                        <b-icon
                            v-if="api.haveError(extension)"
                            v-b-popover.hover="`${$t('Extension error occured:')} ${extension.error}`"
                            icon="exclamation"
                            class="extension-error"
                            :class="getIconClasses('bg-danger')"
                            aria-hidden="true"
                        ></b-icon>
                    </div>
                    <div
                        v-if='controls'
                        class='controls'
                    >
                        <extension-toggle
                            :checked="api.isEnabled(extension)"
                            @click="toggle(extension)"
                        />
                        <b-icon
                            v-if="isServerUpdateAvailable(extension)"
                            icon="cloud-download"
                            :class="getIconClasses('bg-success')"
                            @click="api && api.installExtension(extension)"
                            v-b-popover.hover.top="$t('Update')"
                            aria-hidden="true"
                        ></b-icon>
                        <b-icon
                            icon="gear"
                            :class="getPreferencesIconClasses(extension)"
                            @click="api && api.openPreferences(extension)"
                            v-b-popover.hover.top="$t('Settings')"
                            aria-hidden="true"
                        ></b-icon>
                        <div
                            class='icon-wrapper'
                            v-b-popover.hover.top="getUninstallPopover(extension)"
                        >
                            <b-icon
                                icon="x"
                                :class="getDeleteIconClasses(extension)"
                                @click="api && api.uninstallExtension(extension)"
                                aria-hidden="true"
                            ></b-icon>
                        </div>
                    </div>
                </div>
                <div class='icon-align'>
                    <div class='author'><span v-if="extension.creator">By <b-link :to="getProfileLink(extension.creator)">{{ extension.creator.username }}</b-link></span></div>
                    <div>{{ extension.description }}</div>
                </div>
            </b-overlay>
        </div>
    </div>
</template>

<script>
import { computed, defineComponent, ref, toRefs } from '@vue/composition-api';

import * as types from '../types';

import ExtensionToggle from './ExtensionToggle.vue'
import { useBrowserAPI } from '../js/compositions/browser';
import { getExtensionIcon } from '../js/compositions/extension';
import { getProfileLink } from '../js/compositions/user';

const defaultIconClasses = {
    'rounded-circle': true,
};

/**
 * @param {string} backgroundClass
 * @param {Record<string, boolean>} [extraClasses]
 */
function getIconClasses(backgroundClass, extraClasses) {
    return Object.assign(
        {},
        defaultIconClasses, {
        [backgroundClass]: true,
    },
        extraClasses
    );
}

/**
 * @typedef {object} Props
 * @property {NativeIntegration.LocalExtension[]} extensions
 * @property {boolean} [controls]
 */

export default defineComponent({
    components: {
        ExtensionToggle
    },
    props: {
        extensions: {
            required: true,
            type: types.LocalExtensions
        },
        controls: {
            type: Boolean,
            default: false
        }
    },
    /**
     * @param {Props} props
     */
    setup(props, { root }) {
        const busy = ref(false);
        const { browser } = useBrowserAPI();

        /**
         * @param {NativeIntegration.LocalExtension} extension
         */
        function getPreferencesIconClasses(extension) {
            return getIconClasses('bg-info', { 'disabled': !extension.hasPrefs });
        }

        /**
         * @param {NativeIntegration.LocalExtension} extension
         */
        function getDeleteIconClasses(extension) {
            return getIconClasses('bg-danger', { 'disabled': !!browser.api?.isSystem(extension) });
        }

        /**
         * @param {NativeIntegration.LocalExtension} extension
         */
        function getToggleIcon(extension) {
            return browser.api?.isEnabled(extension) ? 'toggle-on' : 'toggle-off';
        }

        /**
         * @param {NativeIntegration.LocalExtension} extension
         */
        function getToggleVariant(extension) {
            return browser.api?.isEnabled(extension) ? 'success' : 'secondary';
        }

        /**
         * @param {NativeIntegration.LocalExtension} extension
         */
        function getUninstallPopover(extension) {
            return browser.api?.isSystem(extension)
                ? root.$t('Systemwide extensions can not be uninstalled here')
                : root.$t('Uninstall');
        }

        /**
         * @param {NativeIntegration.LocalExtension} extension
         */
        function isServerUpdateAvailable(extension) {
            return !extension.hasUpdate
                && extension.update
                && extension.update.action == 'change'
                && extension.version != extension.update.version;
        }

        /**
         * @param {NativeIntegration.LocalExtension} extension
         * @returns {Promise<void>}
         */
        async function toggle(extension) {
            if (extension.busy || !browser.api) {
                return;
            }

            extension.busy = true;
            let enabled = browser.api.isEnabled(extension);

            browser.api.nativeApi.setExtensionEnabled(extension.uuid, !enabled)
                .then(() => {
                    extension.busy = false;
                });
        }

        const localExtensions = computed(() => props.extensions);

        return {
            ...toRefs(browser),
            localExtensions,
            busy,
            getIconClasses,
            toggle,
            getExtensionIcon,
            isServerUpdateAvailable,
            getUninstallPopover,
            getToggleIcon,
            getToggleVariant,
            getPreferencesIconClasses,
            getProfileLink,
            getDeleteIconClasses
        };
    },
});
</script>

<style lang='scss' scoped>
$extension-toggle-width: 54px;
$icon_width: 32px;
$control_padding: 2px;
$extension-row-padding: 1.5rem;

.b-icon {
    color: #fff;
}

.b-icon:hover {
    filter: brightness(125%);
}

.extensions-list {
    .extension-row {
        padding: $extension-row-padding 0;
        position: relative;
    }

    .extension-row:not(:last-child):after {
        content: "";
        position: absolute;
        left: 10%;
        bottom: 0px;
        width: 80%;
        border-bottom: 1px solid #aaa;
    }

    .extension-row-header {
        display: flex;
        align-items: center;

        h3 {
            font-size: 1.2rem;
            line-height: 32px;
        }

        img {
            width: 32px;
            height: 32px;
            margin-right: 6px;
            vertical-align: bottom;
        }

        .status-icons {
            margin-left: 5px;

            .b-icon {
                width: 20px;
                height: 20px;
                padding: 0 4px;
                margin: 0 $control_padding;
            }

            .extension-error {
                padding: 0;
            }
        }

        .controls {
            display: flex;
            align-items: center;
            margin-left: auto;
            min-width: $extension-toggle-width + ($icon_width * 3) +
                ($control_padding * 4 * 2);

            > * {
                margin: 0 $control_padding;
            }

            .icon-wrapper,
            .b-icon {
                width: $icon_width;
                height: $icon_width;
                cursor: pointer;
            }

            .b-icon {
                padding: 7px;
            }

            .b-icon:hover {
                filter: brightness(125%);
            }

            .b-icon.disabled {
                cursor: not-allowed;
                opacity: 0.5;
            }

            .b-icon.switch {
                width: 48px;
                height: 100%;
                padding: 0;
                margin: 0 2px;
            }

            .switch::before {
                content: "";
                width: 16px;
                height: 16px;
                border-radius: 50%;
                display: block;
                background: #f00;
                transition: background-color 0.25s, background-color 0.25s,
                    transform 0.25s;
            }
        }
    }

    .icon-align {
        margin-left: 38px;
    }

    .author {
        margin-bottom: 5px;
    }
}
</style>
