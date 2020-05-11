/** @type {import('axios')} */
import http from './http'
import routes from '../router/navigation'

export default {
    data() {
        return {
            api: null,
            backend_forms: {

            },
            userMenu: {},
            messages: {},
            unreviewed_extensions: 0,
            user: {}
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
        avatar(avatar) {
            return avatar || '/images/avatar-default.svg';
        },

        can_review() {
            return this.user.is_staff || this.user.is_superuser || this.user.user_permissions?.includes('review.can-review-extensions');
        },

        onLogin() {

        },

        toggleUserMenu() {
            let dd = this.$refs.userDropdownMenu;
            dd.visible ? dd.hide() : dd.show();
        }
    },

    async mounted() {
        this.api = await http;
        // TODO: catch errors when we got notifications
        let hello = (await this.api.get('/hello')).data;
        this.user = hello.user;
        this.backend_forms = hello.forms;
    }
};
