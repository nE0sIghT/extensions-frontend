<template>
    <b-row class="extensions-card">
        <b-col>
            <div class="d-flex align-items-center extension-card-title">
                <div class="flex-grow-1">
                    <h5 class="mb-0">{{ title }}</h5>
                </div>
                <div class="small">
                    <b-link :to="to">{{ $t("Show more") }}</b-link>
                </div>
            </div>
            <b-row class="extensions-row">
                <b-col
                    md="6"
                    lg="3"
                    v-for="extension in extensions"
                    :key="extension.id"
                >
                    <extension-card :extension="extension">
                        <slot :extension="extension"></slot>
                    </extension-card>
                </b-col>
            </b-row>
        </b-col>
    </b-row>
</template>

<script>
import * as types from '../types';

import ExtensionCard from './ExtensionCard.vue';

export default {
    props: {
        title: String,
        to: String,
        extensions: types.Extensions,
    },
    components: {
        ExtensionCard
    }
};
</script>

<style lang='scss' scoped>
.extensions-card {
    .extension-card-title {
        padding: 2rem 0 1rem 0;
        margin-top: 2rem;
        border-top: 1px solid #dfdfdf;
    }

    .extensions-row .card {
        height: 100%;
    }
}
</style>
