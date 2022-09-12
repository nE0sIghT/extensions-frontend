<template>
  <b-container b-fluid='md'>
    <b-row v-if="recommended.results">
      <b-col>
        <extensions-carousel :extensions='recommended.results'></extensions-carousel>
      </b-col>
    </b-row>

    <extensions-card
      :title="$t('New extensions')"
      to="/search/?ordering=-created"
      :extensions="recent.results"
      #default="{ extension }">
        <div class='small text-center'>Created {{ extension.created | moment("from", "now") }}</div>
    </extensions-card>

    <extensions-card
      :title="$t('Last updated')"
      to="/search/?ordering=-updated"
      :extensions="updated.results"
      #default="{ extension }">
        <div class='small text-center'>Updated {{ extension.updated | moment("from", "now") }}</div>
    </extensions-card>

    <extensions-card
      :title="$t('Popular extensions')"
      to="/search/?ordering=-popularity"
      :extensions="popular.results"
      #default="{ extension }">
        <div class='small text-center'>Installs: {{ extension.popularity }}</div>
    </extensions-card>
  </b-container>
</template>

<script>
import constants from '../js/constants'
import ExtensionsCard from '../components/ExtensionsCard'
import ExtensionsCarousel from '../components/ExtensionsCarousel'

const INITIAL_PAGE_SIZE = 4;

export default {
    data() {
        return {
            api: {},
            updated: {},
            popular: {},
            recent: {},
            recommended: {},
        };
    },

    computed: {
        haveRecommended() {
            return this.recommended && this.recommended.tr;
        }
    },

    methods: {
        getActiveExtensions(query) {
            return this.$serverApi.v1ExtensionsList(Object.assign(
                {
                    status: constants.STATUS.ACTIVE,
                    page_size: INITIAL_PAGE_SIZE,
                },
                query
            ));
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
        ExtensionsCard,
        ExtensionsCarousel,
    },

    async mounted() {
        [
            {data: this.updated},
            {data: this.popular},
            {data: this.recent},
            {data: this.recommended},
        ] = await Promise.all([
            this.getUpdatedExtensions(),
            this.getPopularExtensions(),
            this.getNewExtensions(),
            this.getRecommendedExtensions(),
        ]);
    }
};
</script>
