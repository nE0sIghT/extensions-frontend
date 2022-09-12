import axiosApi from 'axios'

import { Configuration, V1Api, V1ApiFactory } from './client'

const apiConfig = new Configuration();
const axios = axiosApi.create();
const siteConfig = axios.get(process.env.EGO_CONFIG_URL || '/config.json').then(response => response.data);

const api = await siteConfig.then((config) => {
    return new V1Api(
        apiConfig,
        config['api_url'],
        axios
    );
});

const apiFp = await siteConfig.then((config) => {
    return V1ApiFactory(
        apiConfig,
        config['api_url'],
        axios
    );
});

export default {
    api,
    apiFp,
    setToken(token) {
        if (token) {
            apiConfig.apiKey = `Token ${token}`;
        }
        else {
            apiConfig.apiKey = null;
        }
    },
};
