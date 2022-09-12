<template>
    <b-container b-fluid='md'>
        <b-row>
            <b-col md='3' class='border rounded'>
                <b-form class='search-form pt-3 pb-3' @submit="onSubmit">
                    <b-form-group>
                        <b-form-input
                            v-model="search.text"
                            :placeholder="$t('Search extensions…')"
                        ></b-form-input>
                    </b-form-group>
                    <b-form-group :label="$t('Filter')" label-class="font-weight-bold">
                        <b-form-checkbox
                            v-model="search.recommended"
                        >
                            {{ $t('Recommended') }}
                        </b-form-checkbox>
                    </b-form-group>
                    <b-form-group :label="$t('Sort by')" label-class="font-weight-bold">
                        <b-form-radio-group
                            v-model="search.ordering"
                            name="ordering"
                            :options="search.orderingOptions"
                            stacked
                        ></b-form-radio-group>
                    </b-form-group>
                    <b-form-group :label="$t('Sort direction')" label-class="font-weight-bold">
                        <b-form-radio-group
                            v-model="search.direction"
                            name="direction"
                            :options="search.directionOptions"
                            stacked
                        ></b-form-radio-group>
                    </b-form-group>
                    <b-form-group :label="$t('Page size')" label-class="font-weight-bold">
                        <b-form-select v-model="search.page_size" :options="Array.from({ length: 20 }, (x, i) => (i + 1) * 5)"></b-form-select>
                    </b-form-group>

                    <b-button variant="primary" type='submit'>{{ $t('Search') }}</b-button>
                </b-form>
            </b-col>
            <b-col md='9'>
                <b-overlay
                    :show="busy"
                    rounded
                    opacity="0.6"
                    spinner-variant="primary"
                >
                    <div v-if="count">
                        <b-pagination-nav
                            :value="page"
                            :number-of-pages="pages"
                            :link-gen="searchLink"
                            use-router
                            align="right"
                            pills
                        ></b-pagination-nav>
                        <extensions-list
                            :extensions="extensions"
                            show-rating
                        ></extensions-list>
                        <b-pagination-nav
                            :value="page"
                            :number-of-pages="pages"
                            :link-gen="searchLink"
                            use-router
                            align="right"
                            pills
                        ></b-pagination-nav>
                    </div>
                    <div v-else class='text-center'>
                        {{ $t("No extensions found while searching “{query}”", { query: $route.params.query }) }}
                    </div>
                </b-overlay>
            </b-col>
        </b-row>
    </b-container>    
</template>

<script>
import ExtensionsList from '../components/ExtensionsList'

export default {
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

            return null;
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
            }} = await this.$serverApi.v1ExtensionsSearchRetrieve({
                query,
                ordering: this.ordering,
                page,
                page_size: this.search.page_size,
                recommended: this.search.recommended
            }));
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
</script>
