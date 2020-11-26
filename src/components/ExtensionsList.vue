<template>
    <div class='extensions-list'>
        <div
            v-for="extension in extensions"
            :key="extension.id"
            class='extension-row d-flex flex-column'
        >
            <div class='extension-row-header'>
                <h3 class='m-0'>
                    <b-link :to="`/extension/${extension.id}`">
                        <img
                            :src='getExtensionIcon(extension)'
                            alt="Extension Icon"
                        />{{ extension.name }}
                    </b-link>
                </h3>

            </div>
            <div class='icon-align'>
                <div class='author'><span v-if="extension.creator">By <b-link :to="`/accounts/profile/${extension.creator.id}`">{{ extension.creator.username }}</b-link></span></div>
                <div>{{ extension.description }}</div>
            </div>
        </div>
    </div>
</template>

<script>
import * as types from '../types';

export default {
    data() {
        return {
            busy: {

            },
        }
    },
    props: {
        extensions: types.Extensions,
        controls: Boolean,
    },
    methods: {
        /**
         * @param {sweettooth.Extension} extension
         */
        getExtensionIcon(extension) {
            return extension.icon || `/images/plugin.png`;
        },
    },
};
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
