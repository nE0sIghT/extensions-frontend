import Vue from 'vue'
import 'vue-router';

import server from './api/server'

import ExtensionsList from '../components/ExtensionsList.vue'

const Search = Vue.extend({
    components: {
        ExtensionsList
    },
    data() {
        return {
            busy: true,
            /** @type {sweettooth.Extension[]} */
            extensions: [],
            count: 0,
            search: {
                text: '',
                page_size: 25,
                recommended: false,
                ordering: 'none',
                direction: 'desc',
                orderingOptions: [
                    { text: this.$t('None'), value: 'none', },
                    { text: this.$t('Created'), value: 'created', },
                    { text: this.$t('Updated'), value: 'updated', },
                    { text: this.$t('Downloaded'), value: 'downloads', },
                    { text: this.$t('Popularity'), value: 'popularity', },
                ],
                directionOptions: [
                    { text: this.$t('Ascending'), value: 'asc', },
                    { text: this.$t('Descending'), value: 'desc', },
                ],
            },
        };
    },

    computed: {
        /**
         * @returns {string}
         */
        ordering() {
            if (this.search.ordering != 'none') {
                return `${this.search.direction == 'desc' && '-' || ''}${this.search.ordering}`;
            }

            return '';
        },
        /**
         * @returns {number}
         */
        page() {
            return parseInt(this.$route.params.page) || 1;
        },
        /**
         * @returns {number}
         */
        pages() {
            return Math.max(1, Math.ceil(this.count / this.search.page_size));
        },
        /**
         * @returns {number}
         */
        page_size() {
            const page_size = this.$route.query.page_size;

            if (typeof page_size !== 'string') {
                return 25;
            }

            return Number.parseInt(page_size) || 25;
        },
    },

    methods: {
        /**
         * @param {Event} event
         * @returns {void}
         */
        onSubmit(event) {
            event.preventDefault();
            this.$router.push(this.searchLink(1));
        },
        /**
         * @param {string} query
         * @param {number} page
         * @returns {Promise<void>}
         */
        async searchExtensions(query, page) {
            this.busy = true;
            this.extensions = [];
            ({
                data: {
                    count: this.count,
                    results: this.extensions,
                }
            } = await server.search(
                query,
                page,
                this.search.page_size,
                this.ordering,
                this.search.recommended
            ));
            this.busy = false;
        },

        /**
         * @param {number} page
         * @returns {string}
         */
        searchLink(page) {
            let url = `/search/${this.search.text || "-"}/${page}?page_size=${this.search.page_size}`;
            if (this.search.ordering != 'none') {
                url += `&ordering=${this.ordering}`;
            }

            if (this.search.recommended) {
                url += `&recommended=${this.search.recommended}`;
            }

            return url;
        },
    },

    /**
     * @returns {void}
     */
    created() {
        this.search.text = this.$route.params.query;
        if (this.search.text == '-') {
            this.search.text = '';
        }

        if (this.$route.query.page_size) {
            this.search.page_size = this.page_size;
        }

        if (this.$route.query.ordering) {
            this.search.ordering = this.ordering;
            if (this.ordering.charAt(0) == '-') {
                this.search.direction = 'desc';
                this.search.ordering = this.ordering.substring(1);
            }
            else {
                this.search.direction = 'asc';
            }
        }

        if (typeof this.$route.query.recommended === 'string') {
            this.search.recommended = ["true", "1"].includes(this.$route.query.recommended.toLowerCase());
        }

        this.searchExtensions(
            this.search.text,
            this.page,
        );
    },

    beforeRouteUpdate(to, from, next) {
        this.searchExtensions(
            to.params.query,
            Number.parseInt(to.params.page) || 1,
        ).then(() => next());
    },
});

export default Search;
