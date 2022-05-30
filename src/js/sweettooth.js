import routes from '../router/navigation'

export default {
    data() {
        return {
            backend_forms: {

            },
            userMenu: {},
            messages: {},
            search: "",
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
        // TODO: catch errors when we got notifications
        let { data: hello } = await this.$serverApi.hello();
        this.user = hello.user;
        this.backend_forms = hello.forms;
    },
};
