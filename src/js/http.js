import axios from 'axios'
import qs from "qs"

const http = (function () {
    const EGO_URL = 'http://localhost:8000/api/v1';

    axios.defaults.paramsSerializer = function(params) {
      return qs.stringify(params, { arrayFormat: "brackets" });
    };

    return Promise.resolve(axios.create({
        baseURL: EGO_URL
    }));
})();

export default http;
