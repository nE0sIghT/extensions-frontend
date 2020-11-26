import Vue from 'vue'

import server from './api/server'
import routes from '../router/navigation'

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
            user: null
        };
    },

    computed: {
        n_unreviewed_extensions() {
            return this.can_review() ? this.unreviewed_extensions : 0;
        },

        navigationMenu() {
            return routes.filter(page => page.showInMenu);
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

            this.$refs.userDropdownMenu.hide();

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
            dd.visible ? dd.hide() : dd.show();
        }
    },

    /**
     * @returns {void}
     */
    mounted() {
        (async () => {
            // TODO: catch errors when we got notifications
            let { data: hello } = await server.hello();
            this.user = hello.user;
            this.backend_forms = hello.forms;
        })().catch(err => console.error(err.message));
    },
});

export default Sweettooth;
