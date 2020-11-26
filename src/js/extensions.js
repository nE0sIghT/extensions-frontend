import Vue from 'vue';

import * as constants from './constants'
import server from './api/server'

import ExtensionsRow from '../components/ExtensionsRow.vue'
import ExtensionsCarousel from '../components/ExtensionsCarousel.vue'

const INITIAL_PAGE_SIZE = 4;

const Extensions = Vue.extend({
    data() {
        return {
            /** @type {import('./api/server').ExtensionResults | null} */
            updated: null,
            /** @type {import('./api/server').ExtensionResults | null} */
            popular: null,
            /** @type {import('./api/server').ExtensionResults | null} */
            recent: null,
            /** @type {import('./api/server').ExtensionResults | null} */
            recommended: null,
        };
    },

    computed: {
        /**
         * @returns {boolean}
         */
        haveRecommended() {
            // @ts-ignore
            return this.recommended && this.recommended.tr;
        }
    },

    methods: {
        /**
         * @param {import('./api/server').Query} query 
         */
        async getActiveExtensions(query) {
            return (await server.extensions({
                params:
                    Object.assign({
                        status: constants.STATUS.ACTIVE,
                        page_size: INITIAL_PAGE_SIZE,
                    }, query)
            })).data;
        },
        getUpdatedExtensions() {
            return this.getActiveExtensions({
                ordering: '-updated',
            });
        },
        getPopularExtensions() {
            return this.getActiveExtensions({
                ordering: '-popularity',
            });
        },
        getNewExtensions() {
            return this.getActiveExtensions({
                ordering: '-created',
            });
        },
        getRecommendedExtensions() {
            return this.getActiveExtensions({
                recommended: 1,
                ordering: '?',
            });
        },
    },

    components: {
        ExtensionsRow,
        ExtensionsCarousel,
    },

    /**
     * @returns {void}
     */
    mounted() {
        (async () => {
            [
                this.updated,
                this.popular,
                this.recent,
                this.recommended,
            ] = await Promise.all([
                this.getUpdatedExtensions(),
                this.getPopularExtensions(),
                this.getNewExtensions(),
                this.getRecommendedExtensions(),
            ]);
        })().catch(err => console.error(err.message));
    }
});

export default Extensions;