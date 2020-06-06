<template>
    <div class='extensions-list'>
        <div
            v-for="extension in extensions"
            :key="extension.uuid"
            class='extension-row d-flex flex-column'
        >
            <b-overlay
                :show="extension.busy"
                rounded
                opacity="0.6"
                spinner-variant="primary"
                no-fade
            >
            <div class='extension-row-header'>
                <h3 class='m-0'>
                    <b-link :to="`/extension/${extension.uuid}`">
                        <img :src='getExtensionIcon(extension)' :alt='extension.name' />{{ extension.name }}
                    </b-link>
                </h3>
                <div class='status-icons'>
                    <b-icon
                        v-if="isSystem(extension)"
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
                        v-if="haveError(extension)"
                        v-b-popover.hover="`${$t('Extension error occured:')} ${extension.error}`"
                        icon="exclamation"
                        class="extension-error"
                        :class="getIconClasses('bg-danger')"
                        aria-hidden="true"
                    ></b-icon>
                </div>
                <div v-if='controls' class='controls'>
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
                            @click="uninstallExtension(extension)"
                            aria-hidden="true"
                        ></b-icon>
                    </div>
                </div>
            </div>
            <div class='icon-align'>
                <div class='author'><span v-if="extension.creator">By <b-link :to="`/user/${extension.creator.username}`">{{ extension.creator.username }}</b-link></span></div>
                <div>{{ extension.description }}</div>
            </div>
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
        extensions: Array,
        controls: Boolean,
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

        getUninstallPopover(extension) {
            return this.isSystem(extension) 
                && this.$t('Systemwide extensions can not be uninstalled here')
                || this.$t('Uninstall');
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
            content: '';
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
                min-width: $extension-toggle-width + ($icon_width * 3) + ($control_padding * 4 * 2);

                > * {
                    margin: 0 $control_padding;
                }

                .icon-wrapper, .b-icon {
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
                        transition: background-color .25s, background-color .25s, transform .25s;
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
