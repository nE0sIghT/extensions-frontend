import { BNavItemDropdown } from 'bootstrap-vue';

import server from './api/server'

import { getProfileLink } from './compositions/user';
import { computed, defineComponent, reactive, ref, toRefs } from '@vue/composition-api';
import { useRouter } from '../router/utils';
import { isAxiosError } from './api/utils';
import { useI18n } from './i18n/utils';

const Sweettooth = defineComponent({
    setup() {
        const { router } = useRouter();
        const { t } = useI18n();

        const $state = reactive({
            login: {
                username: {
                    text: '',
                    /** @type {boolean | null} */
                    state: null
                },
                password: {
                    feedback: '',
                    text: '',
                    /** @type {boolean | null} */
                    state: null
                }
            },
            messages: {},
            search: "",
            unreviewed_extensions: 0
        });

        /** @type {import('@vue/composition-api').Ref<BNavItemDropdown | null>} */
        const userDropdownMenu = ref(null);

        /** @type {import('@vue/composition-api').Ref<HTMLFormElement | null>} */
        const loginForm = ref(null);

        const n_unreviewed_extensions = computed(() => {
            return can_review() ? $state.unreviewed_extensions : 0;
        });

        const user = server.getUser();

        /**
         * @param {string} avatar
         */
        function avatar(avatar) {
            return avatar || '/images/avatar-default.svg';
        }

        function can_review() {
            const u = user.value;

            return u && (u.is_staff || u.is_superuser || u.user_permissions?.includes('review.can-review-extensions'));
        }

        const profileLink = computed(() => {
            return user.value ? getProfileLink(user.value) : '';
        });

        function logout() {
            // TODO: Logout is not fully implemented yet.
            console.log('logout!');
            server.logout();
        }

        function toggleUserMenu() {
            let dd = userDropdownMenu.value;

            if (dd instanceof BNavItemDropdown) {
                console.log('toggle')
                dd.visible ? dd.hide() : dd.show();
            }
        }

        function closeUserMenu() {
            let dd = userDropdownMenu.value;

            if (dd instanceof BNavItemDropdown) {
                dd.hide();
            }

            $state.login = {
                username: {
                    text: '',
                    state: null
                },
                password: {
                    feedback: '',
                    text: '',
                    state: null
                }
            };

            let form = loginForm.value;

            if (form instanceof HTMLFormElement) {
                form.reset();
            }
        }

        function badLogin() {
            $state.login.password.feedback = `${t.value('Your username or password is incorrect.')}`;
            $state.login.username.state = false;
            $state.login.password.state = false;
        }

        /**
         * @param {Event} event
         */
        function onLogin(event) {
            event.preventDefault();

            server.authorize($state.login.username.text, $state.login.password.text).then(() => {
                console.log('Authorized!');
            })
                .then(() => {
                    server.hello();

                    closeUserMenu();
                })
                .catch(err => {
                    if (isAxiosError(err)) {
                        console.error(err.response?.status);
                        if (err.response?.status === 400) {
                            badLogin();
                        }
                    } else {
                        // TODO: Handle this error.
                        closeUserMenu();
                    }

                    console.error(err.message);
                });

            
        }

        /**
         * @param {Event} event
         */
        function onRegister(event) {
            event.preventDefault();

            closeUserMenu();

            router.value.push('/register', undefined, () => {
                // Suppress errors if we're already on the /register page.
            });
        }

        /**
         * @param {Event} event
         */
        function onSearch(event) {
            event.preventDefault();
            router.value.push(`/search/${this.search}`);
            this.search = '';
        }

        return {
            ...toRefs($state),
            user,
            toggleUserMenu,
            loginForm,
            onSearch,
            onLogin,
            onRegister,
            logout,
            avatar,
            n_unreviewed_extensions,
            profileLink,
            userDropdownMenu
        }
    }
});

export default Sweettooth;
