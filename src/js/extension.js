import Vue from 'vue';

import ScreenshotCarousel from '../components/ScreenshotCarousel.vue';
import Comment from '../components/Comment.vue';

import server from './api/server'
import Axios from 'axios';

const Extension = Vue.extend({
    data() {
        return {
            /** @type {sweettooth.Extension | null} */
            extension: null,
            /** @type {sweettooth.Comment[]} */
            comments: [],
            form_html: ''
        };
    },
    components: {
        Comment,
        ScreenshotCarousel
    },
    computed: {
        /**
         * @returns {sweettooth.Screenshot[]}
         */
        screenshots() {
            return this.extension && this.extension.screenshots ? [...this.extension.screenshots] : [];
        }
    },

    methods: {
        getExtension() {
            return server.extension(this.$route.params.id);
        },
        getComments() {
            return server.comments(this.$route.params.id);
        },
        getCommentForm() {
            return server.comment_form(this.$route.params.id);
        }
    },

    /**
     * @returns {void}
     */
    mounted() {
        (async () => {
            ([{ data: this.extension }, { data: { results: this.comments } }] = await Promise.all([
                this.getExtension(),
                this.getComments()
            ]));

            this.form_html = (await this.getCommentForm()).data;
        })()
            .catch(err => console.error(err.message))
            // TODO: Check that finally is polyfilled.
            .finally(() => {
                this.$nextTick(() => {
                    const form = document.querySelector('#commentFormContainer > form');
                    console.log(form);
                    if (form instanceof HTMLFormElement) {
                        console.log("doing...")
                        form.addEventListener("submit", (event) => {
                            event.preventDefault();
                            console.log("submitting...")
                            const data = new FormData(form);

                            Axios.post(form.action, data, {
                                headers: {
                                    'Content-Type': 'multipart/form-data',
                                    'X-Requested-With': 'XMLHttpRequest'
                                }, maxRedirects: 0
                            }).then(() => {
                                console.log("Submitted!");
                                form.reset();

                                return this.getComments();
                            }).then(response => {
                                console.log("uodatubg cinnebts,,,");
                                this.comments = response.data.results;
                            }).catch(error => {
                                console.error(error);
                            });
                        });
                    }
                })

            });
    }
});

export default Extension;
