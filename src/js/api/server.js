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
    extensions(config) {
      return getRequest('/extensions', config);
    },

    hello() {
      return getRequest('/hello');
    },
  };
})();
