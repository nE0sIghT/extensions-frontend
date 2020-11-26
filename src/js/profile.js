import Vue from 'vue'

import server from './api/server'

import ExtensionsList from '../components/ExtensionsList.vue'

const Profile = Vue.extend({
    components: {
        ExtensionsList
    },
    data() {
        return {
            /** @type {sweettooth.Profile | null} */
            profile: null,
            /** @type {sweettooth.Extension[]} */
            extensions: []
        }
    },
    /**
     * @returns {void}
     */
    mounted() {
        (async () => {
            const profile = await server.profile(this.$route.params.id);

            const extensions = (await Promise.all((profile.data.extensions || [])
                .map(id => server.extension(id))))
                .map(r => r.data);

            this.profile = { ...profile.data };
            this.extensions = extensions;
        })().catch(err => console.error(err.message));
    }
});

export default Profile;