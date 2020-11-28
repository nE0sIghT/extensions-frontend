import Vue from 'vue'
import { BNavItemDropdown } from 'bootstrap-vue';

import server from './api/server'
import routes from '../router/navigation'

import { getProfileLink } from './compositions/user';

const Sweettooth = Vue.extend({
    data() {
        return {
            login: {
                username: '',
                password: ''
            },
            messages: {},
            search: "",
            unreviewed_extensions: 0,
            /** @type {sweettooth.User | null} */
            user: null
        };
    },

    computed: {
        /** @returns {number} */
        n_unreviewed_extensions() {
            return this.can_review() ? this.unreviewed_extensions : 0;
        },
        navigationMenu() {
            return routes.filter(page => page.showInMenu);
        },
        profileLink() {
            return getProfileLink(this.user);
        }
    },

    methods: {
        /**
         * @param {string} avatar
         */
        avatar(avatar) {
            return avatar || '/images/avatar-default.svg';
        },

        can_review() {
            return this.user && (this.user.is_staff || this.user.is_superuser || this.user.user_permissions?.includes('review.can-review-extensions'));
        },

        logout() {
            console.log('logout!');
            this.user = null;
            server.logout();
        },

        /**
         * @param {Event} event
         */
        onSubmit(event) {
            event.preventDefault();

            server.authorize(this.login.username, this.login.password).then(() => {
                console.log('Authorized!');
            });

            let dd = this.$refs.userDropdownMenu;

            if (dd instanceof BNavItemDropdown) {
                dd.hide();
            }

            this.login = {
                username: '',
                password: ''
            };
        },

        /**
         * @param {Event} event
         */
        onSearch(event) {
            event.preventDefault();
            this.$router.push(`/search/${this.search}`);
            this.search = '';
        },

        toggleUserMenu() {
            let dd = this.$refs.userDropdownMenu;

            if (dd instanceof BNavItemDropdown) {
                dd.visible ? dd.hide() : dd.show();
            }
        }
    },

    /**
     * @returns {void}
     */
    mounted() {
        (async () => {
            // TODO: catch errors when we got notifications
            let { data: hello } = await server.hello();

            if (hello.user && hello.user.id != null) {
                this.user = hello.user;
            }
        })().catch(err => console.error(err.message));
    },
});

export default Sweettooth;
