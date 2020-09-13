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
            search: {
                text: '',
                page_size: 25,
                recommended: false,
                ordering: 'none',
                direction: 'desc',
                orderingOptions: [
                    { text: this.$t('None'),         value: 'none', },
                    { text: this.$t('Created'),      value: 'created', },
                    { text: this.$t('Updated'),      value: 'updated', },
                    { text: this.$t('Downloaded'),   value: 'downloads', },
                    { text: this.$t('Popularity'),   value: 'popularity', },
                ],
                directionOptions: [
                    { text: this.$t('Ascending'),    value: 'asc', },
                    { text: this.$t('Descending'),   value: 'desc', },
                ],
            },
        };
    },

    computed: {
        ordering() {
            if(this.search.ordering != 'none')
            {
                return `${this.search.direction == 'desc' && '-' || ''}${this.search.ordering}`;
            }
        },

        page() {
            return parseInt(this.$route.params.page) || 1;
        },

        pages() {
            return Math.max(1, Math.ceil(this.count / this.search.page_size));
        },

        page_size() {
            return this.$route.query.page_size || 25;
        },
    },

    methods: {
        onSubmit(event) {
            event.preventDefault();
            this.$router.push(this.searchLink(1));
        },

        async searchExtensions(query, page) {
            this.busy = true;
            this.extensions = [];
            ({ data: {
                count: this.count,
                results: this.extensions,
            }} = await this.api.server.search(
                query,
                page,
                this.search.page_size,
                this.ordering,
                this.search.recommended
            ));
            this.busy = false;
        },

        searchLink(page) {
            let url = `/search/${this.search.text || "-"}/${page}?page_size=${this.search.page_size}`;
            if(this.search.ordering != 'none')
            {
                url += `&ordering=${this.ordering}`;
            }

            if(this.search.recommended)
            {
                url += `&recommended=${this.search.recommended}`;
            }

            return url;
        },
    },

    created() {
        this.search.text = this.$route.params.query;
        if(this.search.text == '-')
        {
            this.search.text = '';
        }

        if(this.$route.query.page_size)
        {
            this.search.page_size = parseInt(this.$route.query.page_size);
        }

        if(this.$route.query.ordering)
        {
            this.search.ordering = this.$route.query.ordering;
            if(this.$route.query.ordering.charAt(0) == '-')
            {
                this.search.direction = 'desc';
                this.search.ordering = this.$route.query.ordering.substring(1);
            }
            else
            {
                this.search.direction = 'asc';
            }
        }

        if(this.$route.query.recommended)
        {
            this.search.recommended = ["true", "1"].includes(this.$route.query.recommended.toLowerCase());
        }

        return this.searchExtensions(
            this.search.text,
            this.page,
        );
    },

    beforeRouteUpdate (to, from, next) {
        return this.searchExtensions(
            to.params.query,
            to.params.page,
        ).then(() => next());
    },
};
