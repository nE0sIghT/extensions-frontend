<template>
  <div v-if="!registered">
    <validation-observer v-slot="{ handleSubmit }" ref="validation">
        <b-form @submit.prevent="handleSubmit(onSubmit)" @reset="onReset" autocomplete='off'>
            <h3>Register new account</h3>
            <validated-input
                v-model='registration.display_name'
                label="Display name"
                icon='person-lines-fill'
                rules='required|min:3'
            />
            <validated-input
                v-model='registration.username'
                label="Login"
                icon='person-fill'
                rules='required|min:3'
                vid='username'
            />
            <validated-input
                v-model='registration.email'
                label="Email"
                icon='at'
                rules='required|email'
            />
            <validated-input
                v-model='registration.password'
                label="Password"
                icon='shield-fill'
                rules='required|min:8'
                type='password'
            />
            <validated-input
                v-model='registration.password_confirm'
                label="Repeat password"
                placeholder="Repeat your password"
                icon='shield-fill-check'
                rules='required|min:8|confirmed:password'
                type='password'
            />

            <div class='text-center'>
                <b-button variant="primary" type="submit" class='mx-1'>{{ $t('Register') }}</b-button>
                <b-button variant="danger" type="reset" class='mx-1'>{{ $t('Reset') }}</b-button>
            </div>
        </b-form>
    </validation-observer>
  </div>
  <div v-else>
    <b-alert variant='primary' show>
        <h4>{{ $t('Your account is successfully registered.') }}</h4>
        <p>
            {{ $t('Please check your email for confirmation instructions.') }}
        </p>
    </b-alert>
  </div>
</template>

<script>
import { ValidationObserver } from 'vee-validate';
import ValidatedInput from '../components/ValidatedInput.vue'

export default {
    data() {
        return {
            registration: {},
            registered: false,
        };
    },

    methods: {
        onSubmit() {
            this.$serverApiFp.v1AccountsRegisterCreate(this.registration).then(() => {
                this.registered = true;
            }).catch((error) => {
                if (error?.response?.status == 400 && error?.response?.data) {
                    this.$refs.validation.setErrors(error.response.data);
                }
            });
        },

        onReset() {
            this.registration = {};
            this.$nextTick(() => {
                this.$refs.validation.reset();
            });
        },
    },

    components: {
        ValidatedInput,
        ValidationObserver,
    }
}
</script>
