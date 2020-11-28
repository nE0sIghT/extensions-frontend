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
                <div class='author'><span v-if="extension.creator">By <b-link :to="getProfileLink(extension.creator)">{{ extension.creator.username }}</b-link></span></div>
                <div>{{ extension.description }}</div>
            </div>
        </div>
    </div>
</template>

<script>
import { defineComponent } from '@vue/composition-api';

import * as types from '../types';

import { getExtensionIcon } from '../js/compositions/extension';
import { getProfileLink } from '../js/compositions/user';

export default defineComponent({
    props: {
        extensions: {
            type: types.Extensions,
            default: [],
        }
    },
    setup() {
        return {
            getExtensionIcon,
            getProfileLink
        };
    }
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
    }

    .icon-align {
        margin-left: 38px;
    }

    .author {
        margin-bottom: 5px;
    }
}
</style>
