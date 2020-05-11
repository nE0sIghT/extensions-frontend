import constants from './constants'
import http from './http'
import ExtensionsCard from '../components/ExtensionsCard'
import ExtensionsCarousel from '../components/ExtensionsCarousel'

const INITIAL_PAGE_SIZE = 4;

export default {
    data() {
        return {
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
            return this.api.get('/extensions', { params: 
                Object.assign({
                    status: constants.STATUS.ACTIVE,
                    page_size: INITIAL_PAGE_SIZE,
                }, query)
            });
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
        this.api = await http;

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
        console.log(this.recommended);
    }
};
