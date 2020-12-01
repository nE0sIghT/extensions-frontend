import Vue from 'vue';
import Axios from 'axios';
import StarRating from 'vue-star-rating';

import { computed, defineComponent, onMounted, onUnmounted, reactive, toRefs, nextTick } from '@vue/composition-api';

import ScreenshotCarousel from '../components/ScreenshotCarousel.vue';
import Comment from '../components/Comment.vue';

import server from './api/server';

import { useRouter } from '../router/utils';

import { getProfileLink } from './compositions/user';


/**
 * @param {{ rating: number }} state 
 */
const StarComponent = state => defineComponent({
    render(h) {
        return h(StarRating, {
            props: {
                rating: state.rating,
                showRating: false,
                roundedCorners: true,
                activeColor: "#555555",
                inactiveColor: "#ffffff",
                borderColor: "#555555",
                borderWidth: 5,
                starSize: 30,
                padding: 7
            },
            on: {
                /**
                 * @param {number} rating
                 */
                'rating-selected'(rating) {
                    state.rating = rating;
                }
            }
        });
    }
});

const Extension = defineComponent({
    components: {
        Comment,
        ScreenshotCarousel
    },
    setup() {
        const { route } = useRouter();

        const $state = reactive({
            /** @type {sweettooth.Extension | null} */
            extension: null,
            /** @type {sweettooth.Comment[]} */
            comments: [],
            form_html: '',
        });

        const $starState = reactive({
            rating: -1
        });

        /** @type {Vue | null} */
        let ratingComponent = null;
        /** @type {HTMLFormElement | null} */
        let formElement = null;

        const screenshots = computed(() => {
            return $state.extension && $state.extension.screenshots ? [...$state.extension.screenshots] : [];
        });

        const extensionId = computed(() => route.value.params.id);


        async function getExtension() {
            const response = await server.extension(extensionId.value);

            return response.data;
        }

        async function getComments() {
            const response = await server.comments(extensionId.value);

            return response.data?.results ?? [];
        }

        async function getCommentForm() {
            const response = await server.comment_form(extensionId.value);

            return response.data;
        }

        /**
         * @param {Event} event 
         */
        function onSubmit(event) {
            if (!formElement) {
                return;
            }

            event.preventDefault();

            const data = new FormData(formElement);

            if ($starState.rating > 0) {
                data.append('rating', `${$starState.rating}`);
            }

            Axios.post(formElement.action, data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'X-Requested-With': 'XMLHttpRequest'
                }, maxRedirects: 0
            }).then(() => {
                // Reset the star rating
                $starState.rating = -1;
                // Clear the form fields
                formElement?.reset();

                return getComments();
            }).then(comments => {
                $state.comments = comments;
            }).catch(error => {
                console.error(error);
            });
        }

        onMounted(() => {
            (async () => {
                ([
                    $state.extension,
                    $state.comments,
                    $state.form_html
                ] = await Promise.all([
                    getExtension(),
                    getComments(),
                    getCommentForm()
                ]));
            })()
                .catch(err => console.error(err.message))
                // TODO: Check that finally is polyfilled.
                .finally(() => {
                    // We have to wait for the next render tick for the comment form to be loaded via v-html.
                    nextTick(() => {
                        // Select the element.
                        const element = document.querySelector('#commentFormContainer > form');

                        if (!(element instanceof HTMLFormElement)) {
                            return;
                        }

                        formElement = element;
                        formElement.addEventListener('submit', onSubmit);

                        const rating = formElement.querySelector('.rating');

                        if (!rating) {
                            return;
                        }

                        const mountpoint = document.createElement('div');

                        rating.append(mountpoint);

                        ratingComponent = new Vue({
                            render: h => h(StarComponent($starState))
                        }).$mount(mountpoint);
                    });
                });
        });

        onUnmounted(() => {
            formElement?.removeEventListener('submit', onSubmit);
            // Rating component isn't a child component so we need to manually chain destroy.
            ratingComponent?.$destroy();

            formElement = null;
            ratingComponent = null;
        });

        return {
            ...toRefs($state),
            getProfileLink,
            screenshots
        }
    },
});

export default Extension;
