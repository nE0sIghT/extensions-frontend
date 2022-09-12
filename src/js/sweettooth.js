import Vue from 'vue'
import routes from '../router/navigation'
import constants from './constants';

export default Vue.extend({
    data() {
        return {
            userMenu: {},
            messages: {},
            search: "",
            unreviewed_extensions: 0,
            user: {},
            login: {
                username: '',
                password: '',
                error: '',
                remember: false,
            },
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
            this.login.error = '';
            this.$serverApiFp.v1AccountsLoginCreate({
                'login': this.login.username,
                'password': this.login.password,
            }).then(data => {
                this.setToken(data.data.token, this.login.remember);
                this.$refs.userDropdownMenu.hide(true);
            }).catch(error => {
                console.log(error);
                this.login.error = error?.response?.data?.detail;
            });
        },

        onLogout() {
            this.$serverApiFp.v1AccountsLogoutCreate({ 'revoke_token': true }).finally(() => {
                this.removeToken();
                this.user = {};
            })
        },

        hideUserDropdownMenu() {
            this.$refs.userDropdownMenu.hide(true);
        },

        async sayHello() {
            let { data: hello } = await this.$serverApi.v1HelloRetrieve();
            this.user = hello.user;
        },

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

    async mounted() {
        this.$sweettoothEvents.$on(constants.TOKEN_SET_EVENT, this.sayHello);
        this.sayHello();
    },
});
