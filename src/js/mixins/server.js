import http from '../api/server'

export default {
    data() {
        return {
            api: {
                server: false,
            },
        };
    },

    created() {
        this.api.server = http;
    }
};
