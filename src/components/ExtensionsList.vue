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
                <div class='controls'>
                    <extension-toggle :checked="isEnabled(extension)" @click="toggle(extension)"></extension-toggle>
                    <b-icon
                        icon="gear"
                        :class="getPreferencesIconClasses(extension)"
                        @click="openPreferences(extension)"
                        aria-hidden="true"
                    ></b-icon>
                    <b-icon
                        icon="x"
                        :class="getDeleteIconClasses(extension)"
                        @click="deleteExtension(extension)"
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
        getPreferencesIconClasses(extension) {
            return Object.assign({}, defaultIconClasses, {
                'bg-info': true,
                'disabled': !extension.hasPrefs,
            });
        },

        getDeleteIconClasses(extension) {
            return Object.assign({}, defaultIconClasses, {
                'bg-danger': true,
                'disabled': this.isSystem(extension),
            });
        },

        getToggleIcon(extension) {
            return this.isEnabled(extension) && 'toggle-on' || 'toggle-off';
        },

        getToggleVariant(extension) {
            return this.isEnabled(extension) && 'success' || 'secondary';
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
    }
}
</script>

<style lang='scss' scoped>
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


            .controls {
                display: flex;
                align-items: center;
                margin-left: auto;

                > * {
                    margin: 0 2px;
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
            margin-left: 40px;
        }

        p.author {
            margin-bottom: 5px;
        }
    }
</style>
