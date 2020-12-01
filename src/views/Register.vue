<template>
    <b-container fluid>
        <b-row class="justify-content-center">
            <b-col
                cols="12"
                md="8"
                lg="6"
            >
                <h3>Account Registration</h3>
                <b-form @submit="onSubmit">
                    <b-form-group
                        id="username-input-group"
                        label="Username"
                        label-for="username-input"
                    >
                        <b-form-input
                            id="username-input"
                            v-model="form.username"
                            type="username"
                            required
                            placeholder="Enter username"
                            aria-describedby="username-help-text"
                        />
                        <b-form-text id="username-help-text">
                            {{ $t('Required. 30 characters or fewer. Letters, digits and @/./+/-/_ only.') }}
                        </b-form-text>
                    </b-form-group>
                    <b-form-group
                        id="email-input-group"
                        label="Email address"
                        label-for="email-input"
                    >
                        <b-form-input
                            id="email-input"
                            v-model="form.email"
                            type="email"
                            required
                            placeholder="Enter email"
                        />
                    </b-form-group>

                    <b-form-group
                        id="password-input-group"
                        label="Password"
                        label-for="password-input"
                    >
                        <b-form-input
                            id="password-input"
                            type="password"
                            v-model="form.password"
                            required
                            placeholder="Enter password"
                        />
                    </b-form-group>

                    <b-form-group
                        id="password-confirm-input-group"
                        label="Confirm password"
                        label-for="password-confirm-input"
                    >
                        <b-form-input
                            id="password-confirm-input"
                            type="password"
                            v-model="form.passwordConfirm"
                            required
                            placeholder="Enter password again"
                            aria-describedby="password-confirm-help-text"
                        />
                        <b-form-text id="password-confirm-help-text">
                            Enter the same password as before, for verification.
                        </b-form-text>
                    </b-form-group>

                    <b-button
                        block
                        type="submit"
                        variant="primary"
                    >
                        Register
                    </b-button>
                </b-form>
            </b-col>
        </b-row>
    </b-container>
</template>

<script lang="ts">
import { defineComponent, reactive } from "@vue/composition-api";

import { useRouter } from "../router/utils";

import server from "../js/api/server";

export default defineComponent({
    name: "Register",
    setup() {
        const { router } = useRouter();

        const form = reactive({
            email: "",
            username: "",
            password: "",
            passwordConfirm: ""
        });

        function onSubmit(event: Event) {
            event.preventDefault();

            const result = server.register({ ...form });

            // TODO: Handle errors and don't redirect.
            console.log(result);

            router.value.push('/login/');
        }

        return { form, onSubmit };
    }
});
</script>