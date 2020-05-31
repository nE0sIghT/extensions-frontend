import axios from 'axios'
import qs from "qs"

export default (function () {
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

  return Promise.resolve({
    extensions(config) {
      return getRequest('/extensions', config);
    },

    hello() {
      return getRequest('/hello');
    },

  });
})();
