<template>
    <div class='extensions-list'>
        <extension-row
            v-for="extension in extensions"
            :key="extension.uuid"
            :extension="extension"
            icon-width="32px"
            :show-controls="showControls"
            :show-rating="showRating"
            class='extension-row'
        />
    </div>
</template>

<script>
import common from '../js/mixins/common'
import browserMixin from '../js/mixins/browser'
import ExtensionRow from './ExtensionRow'

export default {
    mixins: [common, browserMixin],
    components: {
      ExtensionRow,
    },

    props: {
        extensions: Array,
        showControls: {
          type: Boolean,
          default: false,
        },
        showRating: {
          type: Boolean,
          default: false,
        },
    },

}
</script>

<style lang='scss' scoped>
    $extension-row-padding: 1.5rem;

    .extensions-list {
        .extension-row {
            padding: $extension-row-padding 0;
        }

        .extension-row:not(:last-child):after {
            content: '';
            position: absolute;
            left: 10%;
            bottom: 0px;
            width: 80%;
            border-bottom: 1px solid #aaa;
        }
    }
</style>
