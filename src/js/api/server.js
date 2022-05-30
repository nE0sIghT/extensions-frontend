import axios from 'axios'
import qs from "qs"

import constants from '../constants'

const defaultRequestParameters = {
    paramsSerializer: (params) => qs.stringify(params, { arrayFormat: "brackets" })
}

const config = axios.get(process.env.EGO_CONFIG_URL || '/config.json').then(response => response.data);
const axiosClient = config.then((config) => {
    return axios.create({
        baseURL: new URL('/api/v1', config['api_url']).toString(),
    })
});

function getRequest(url, config) {
    return axiosClient.then(client => client.get(url, Object.assign({}, defaultRequestParameters, config)));
}

export default (function () {
  return {
    hello() {
        return getRequest('/hello/');
    },

    extension(uuid) {
        return getRequest(`/extensions/${uuid}/`);
    },

    extensions(config) {
        return getRequest('/extensions/', config);
    },

    extensionVersions(uuid) {
        return getRequest('/extensions-versions/', {
            params: {
                'extension__uuid': uuid,
            },
        });
    },

    search(query, page = 1, page_size = 25, ordering, recommended = false) {
        if(query && query != '-')
        {
            return axiosClient.then(client => client.get(
              `/extensions/search/${query}/`,
              {
                  params: {
                      page,
                      page_size,
                      ordering,
                      recommended,
                  },
              }
            ))
        }
        else
        {
            return this.extensions({
                params: {
                    page,
                    page_size,
                    ordering,
                    status: constants.STATUS.ACTIVE,
                }
            });
        }
    },

    updates(extensions, shellVersion, versionValidationEnabled) {
        return axiosClient.then(client => client.post(
          '/extensions/updates/',
          {
            installed: extensions,
            shell_version: shellVersion,
            version_validation_enabled: versionValidationEnabled,
          }
        ));
    },
  };
})();
