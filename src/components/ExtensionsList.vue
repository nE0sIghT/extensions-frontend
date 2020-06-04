<template>
    <div class='extensions-list'>
        <div
            v-for="extension in extensions"
            :key="extension.uuid"
            class='d-flex flex-column'
        >
            <b-overlay
                :show="extension.busy"
                rounded
                opacity="0.6"
                spinner-variant="primary"
                no-fade
            >
            <div class='extensions-list-header'>
                <h3 class='m-0'>
                    <b-link :to="`/extension/${extension.uuid}`">
                        <img :src='getExtensionIcon(extension)' :alt='extension.name' />{{ extension.name }}
                    </b-link>
                </h3>
                <div class='status-icons'>
                    <b-icon
                        v-if="extension.hasUpdate"
                        v-b-popover.hover="$t('Update will be applied on next Shell restart')"
                        icon="cloud-download"
                        :class="getIconClasses('bg-success')"
                        aria-hidden="true"
                    ></b-icon>
                </div>
                <div class='controls'>
                    <extension-toggle :checked="isEnabled(extension)" @click="toggle(extension)"></extension-toggle>
                    <b-icon
                        v-if="isServerUpdateAvailable(extension)"
                        icon="cloud-download"
                        :class="getIconClasses('bg-success')"
                        @click="installExtension(extension)"
                        v-b-popover.hover.top="$t('Update')"
                        aria-hidden="true"
                    ></b-icon>
                    <b-icon
                        icon="gear"
                        :class="getPreferencesIconClasses(extension)"
                        @click="openPreferences(extension)"
                        aria-hidden="true"
                    ></b-icon>
                    <b-icon
                        icon="x"
                        :class="getDeleteIconClasses(extension)"
                        @click="uninstallExtension(extension)"
                        aria-hidden="true"
                    ></b-icon>
                </div>
            </div>
            <p class='author'><span v-if="extension.creator">By <b-link :to="`/user/${extension.creator.username}`">{{ extension.creator.username }}</b-link></span></p>
            <p>{{ extension.description }}</p>
            </b-overlay>
        </div>
    </div>
</template>

<script>
import common from '../js/mixins/common'
import browserMixin from '../js/mixins/browser'
import ExtensionToggle from './ExtensionToggle'

const defaultIconClasses = {
    'rounded-circle': true,
};

export default {
    mixins: [common, browserMixin],
    components: {
        ExtensionToggle
    },

    data() {
        return {
            busy: {

            },
        }
    },

    props: {
        extensions: Array
    },

    methods: {
        getIconClasses(backgroundClass, extraClasses) {
            return Object.assign(
                {},
                defaultIconClasses, {
                    [backgroundClass]: true,
                },
                extraClasses
            );
        },

        getPreferencesIconClasses(extension) {
            return this.getIconClasses('bg-info', { 'disabled': !extension.hasPrefs });
        },

        getDeleteIconClasses(extension) {
            return this.getIconClasses('bg-danger', { 'disabled': this.isSystem(extension) });
        },

        getToggleIcon(extension) {
            return this.isEnabled(extension) && 'toggle-on' || 'toggle-off';
        },

        getToggleVariant(extension) {
            return this.isEnabled(extension) && 'success' || 'secondary';
        },

        isServerUpdateAvailable(extension) {
            return !extension.hasUpdate
                    && extension.update
                    && extension.update.action == 'change'
                    && extension.version != extension.update.version;
        },

        async toggle(extension) {
            if(extension.busy)
            {
                return;
            }

            extension.busy = true;
            let enabled = this.isEnabled(extension);
            let api = await this.api.browser;

            return api.setExtensionEnabled(extension.uuid, !enabled)
                .then(() => {
                    extension.busy = false;
                });
        },
    },
}
</script>

<style lang='scss' scoped>
    $extension-toggle-width: 54px;
    $icon_width: 32px;
    $control_padding: 2px;

    .b-icon {
        color: #fff;
    }

    .extensions-list {
        .extensions-list-header {
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
            }

            .controls {
                display: flex;
                align-items: center;
                margin-left: auto;
                min-width: $extension-toggle-width + ($icon_width * 3) + ($control_padding * 4 * 2);

                > * {
                    margin: 0 $control_padding;
                }

                .b-icon {
                    width: 32px;
                    height: 32px;
                    padding: 7px;
                    color: #fff;
                    cursor: pointer;
                }

                .b-icon.bg-info:hover {
                    background-color: #2bc !important;
                }

                .b-icon.bg-danger:hover {
                    background-color: #f00 !important;
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
                        transition: background-color .25s, background-color .25s, transform .25s;
                }
            }
        }

        div > p {
            margin-left: 38px;
        }

        p.author {
            margin-bottom: 5px;
        }
    }
</style>
