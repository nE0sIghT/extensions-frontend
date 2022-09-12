<template>
    <div>
        <validation-observer v-slot="{ handleSubmit }" ref="validation">
            <b-form @submit.prevent="handleSubmit(onResetPassword)" @reset="onReset" autocomplete='off'>
                <h3>{{ form_title }}</h3>
                <b-alert v-if='detail' :variant='alert' show>{{ detail }}</b-alert>
                <validated-input
                    v-if='!verify'
                    v-model='login'
                    label="Login"
                    icon='person-fill'
                    rules='required|min:3'
                    vid='login'
                />

                <div v-else>
                    <validated-input
                        v-model='password'
                        label="Password"
                        icon='shield-fill'
                        rules='required|min:8'
                        type='password'
                    />
                    <validated-input
                        v-model='password_confirm'
                        label="Repeat password"
                        placeholder="Repeat your password"
                        icon='shield-fill-check'
                        rules='required|min:8|confirmed:password'
                        type='password'
                    />
                </div>

                <div class='text-center'>
                    <b-button variant="primary" type="submit" class='mx-1'>{{ $t('Submit') }}</b-button>
                    <b-button variant="danger" type="reset" class='mx-1'>{{ $t('Reset') }}</b-button>
                </div>
            </b-form>
        </validation-observer>
    </div>
</template>

<script>
import { ValidationObserver } from 'vee-validate';
import ValidatedInput from '../components/ValidatedInput.vue'

export default {
    data() {
        return {
            alert: 'danger',
            detail: '',
            login: '',
            password: '',
            password_confirm: '',
            verify: false,
        };
    },

    computed: {
        form_title() {
            return this.verify && this.$t('New password') || this.$t('Reset password');
        },
    },

    methods: {
        onResetPassword() {
            if (!this.verify) {
                this.$serverApiFp.v1AccountsSendResetPasswordLinkCreate({ login: this.login }).then((response) => {
                    this.detail = response?.data?.detail;
                    this.alert = 'success';
                }).catch((error) => {
                    if (error?.response?.status == 400 && error?.response?.data) {
                        this.$refs.validation.setErrors(error.response.data);
                    }
                    this.detail = error?.response?.data?.detail;
                    this.alert = 'danger';
                });
            }
            else {
                this.$serverApiFp.v1AccountsResetPasswordCreate({...this.verify, ...{ password: this.password }}).then(response => {
                    this.detail = response?.data?.detail;
                    this.alert = 'success';
                }).catch(error => {
                    if (error.response?.data?.detail) {
                        this.detail = error.response?.data?.detail;
                    }
                    else {
                        this.$refs.validation.setErrors(error.response.data);
                    }
                });
            }
        },

        onReset() {
            this.username = this.password = this.password_confirm = '';
            this.$nextTick(() => {
                this.$refs.validation.reset();
                this.detail = '';
            });
        },
    },

    async mounted() {
        let { user_id, timestamp, signature } = this.$route.query;

        if (!user_id || !timestamp || !signature) {
            return;
        }

        this.verify = { user_id, timestamp, signature };
    },

    components: {
        ValidatedInput,
        ValidationObserver,
    },
}
</script>
