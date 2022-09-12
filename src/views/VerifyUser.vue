<template>
    <div>
        <div class="d-flex justify-content-center align-items-center" v-if='loading'>
            <b-spinner :label="status" variant='primary'></b-spinner>
            <div class='m-1'>{{ status }}</div>
        </div>
        <div v-else>
            <b-alert v-for="(field_errors, field) in errors" :key="field" variant='danger' show>
                <h4>{{ field }}</h4>
                <p v-for="(error, index) in field_errors" :key='`${field}${index}`'>
                    {{ error }}
                </p>
            </b-alert>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            loading: true,
            errors: {},
            status: '',
        };
    },

    async mounted() {
        this.status = this.$t('Verifying user...');
        let { user_id, timestamp, signature } = this.$route.query;

        if (!user_id || !timestamp || !signature) {
            this.status = this.$t('Verify parameters does not found');
            this.loading = false;
            return;
        }

        this.$serverApiFp.v1AccountsVerifyRegistrationCreate({user_id, timestamp, signature}).then(response => {
            this.setToken(response.data.token);
            this.$router.push('/');
        }).catch(response => {
            this.status = this.$t('Unable to verify registration');

            if (response.response?.data?.detail) {
                this.errors = {
                    [this.status]: [response.response?.data?.detail],
                };
            }
            else {
                this.errors = response.response?.data;
            }
        }).finally(() => {
            this.loading = false;
        });
    },
}
</script>
