import serverMixin from './mixins/server'
import ExtensionsList from '../components/ExtensionsList'

export default {
    mixins: [serverMixin],
    components: {
        ExtensionsList
    },

    data() {
        return {
            busy: true,
            extensions: [],
            count: 0,
        };
    },

    computed: {
        page() {
            return parseInt(this.$route.params.page) || 1;
        },

        pages() {
            return Math.max(1, Math.ceil(this.count / this.page_size));
        },

        page_size() {
            return this.$route.query.page_size || 25;
        },
    },

    methods: {
        async search(query, page) {
            this.busy = true;
            this.extensions = [];
            ({ data: {
                count: this.count,
                results: this.extensions,
            }} = await this.api.server.search(query, page, this.page_size));
            this.busy = false;
        },

        searchLink(page) {
            return `/search/${this.$route.params.query}/${page}?page_size=${this.page_size}`;
        },
    },

    created() {
        return this.search(
            this.$route.params.query,
            this.page,
        );
    },

    beforeRouteUpdate (to, from, next) {
        return this.search(
            to.params.query,
            to.params.page,
        ).then(() => next());
    },
};
