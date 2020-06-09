import axios from 'axios'
import qs from "qs"

const EGO_URL = 'http://localhost:8000/api/v1';
const defaultRequestParameters = {
    paramsSerializer: (params) => qs.stringify(params, { arrayFormat: "brackets" })
}

const client = axios.create({
    baseURL: EGO_URL
});

function getRequest(url, config) {
    return client.get(url, Object.assign({}, defaultRequestParameters, config));
}

export default (function () {
  return {
    hello() {
        return getRequest('/hello/');
    },

    extensions(config) {
        return getRequest('/extensions/', config);
    },

    search(query, page = 1, page_size = 25, ordering) {
        return client.get(`/extensions/search/${query}/`, {
            params: {
                page,
                page_size,
                ordering,
            },
        });
    },

    updates(extensions, shellVersion, versionValidationEnabled) {
        return client.post('/extensions/updates/', {
            installed: extensions,
            shell_version: shellVersion,
            version_validation_enabled: versionValidationEnabled,
        });
    },
  };
})();
