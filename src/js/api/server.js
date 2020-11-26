import axios from 'axios'
import qs from "qs"

import * as constants from '../constants'

import Cookie from 'universal-cookie';

const EGO_URL = '/api/v1';

const defaultGetParameters =
{
    /**
     * @param {Record<string, any>} params
     */
    paramsSerializer: (params) => qs.stringify(params, { arrayFormat: "brackets" })
}

/**
 * @param {string} csrftoken
 */
const defaultPostParameters = (csrftoken) => ({
    headers: {
        'X-CSRFToken': csrftoken
    }
});

const client = axios.create({
    baseURL: EGO_URL
});

/** 
 * @typedef {object} Query
 * @property {string} [ordering]
 * @property {0 | 1} [recommended]
 */

/**
 * @param {string} url
 * @param {Record<string, any>} [config]
 */
function GET(url, config) {
    return client.get(url, Object.assign({}, defaultGetParameters, config));
}

const cookie = new Cookie();

async function ensureCSRF() {
    let csrftoken = cookie.get('csrftoken');
    if (!csrftoken) {
        await GET('/auth/csrf/');

        csrftoken = cookie.get('csrftoken');

        if (!csrftoken) {
            // TODO: Handle this
            throw new Error(`Failed to verify content security with backend.`);
        }

        return csrftoken;
    }

    return Promise.resolve(csrftoken);
}

/**
 * @param {string} url
 * @param {Record<string, any>} [data]
 * @param {Record<string, any>} [config]
 */
function POST(url, data = {}, config = {}) {
    return ensureCSRF().then((csrftoken) => client.post(url, data, Object.assign({}, defaultPostParameters(csrftoken), config)));
}

/** 
 * @typedef {Promise<import('axios').AxiosResponse<T>>} APIResponse
 * @template T
 */

/** 
 * @template T
 * @typedef {object} APIResultSet
 * @property {null | string} previous
 * @property {null | string} next
 * @property {T[]} results
 * @property {number} count
 */

/** @typedef {APIResultSet<sweettooth.Extension>} ExtensionResults */
/** @typedef {APIResultSet<sweettooth.Comment>} CommentResults */

class ServerAPI {
    hello() {
        return GET('/hello/');
    }

    /**
     * @param {string} id
     * @returns {APIResponse<sweettooth.Profile>}
     */
    profile(id) {
        return GET(`/profile/${id}`);
    }

    /**
     * @param {string} username
     * @param {string} password
     */
    authorize(username, password) {
        return POST('/auth/login/', {
            username,
            password
        });
    }

    logout() {
        // TODO: Write the backend endpoint for logout.
        return POST('/auth/logout/');
    }

    /**
     * @param {string} extensionId
     * @returns {APIResponse<string>}
     */
    comment_form(extensionId) {
        return GET('/comment/form/', {
            params: {
                id: extensionId
            }
        });
    }

    /**
     * @param {string} extensionId
     * @param {number} page
     * @returns {APIResponse<CommentResults>}
     */
    comments(extensionId, page = 1) {
        // TODO: Expose a new non-root endpoint for comments.
        return GET('/comments/', {
            params: {
                page,
                object_pk: extensionId
            }
        });
    }

    /**
     * @param {string} commentId
     * @returns {APIResponse<sweettooth.Comment>}
     */
    comment(commentId) {
        return GET(`/comments/${commentId}`);
    }

    /**
     * @param {Record<string, any>} [config]
     * @returns {APIResponse<ExtensionResults>}
     */
    extensions(config) {
        return GET('/extensions/', config);
    }

    /**
     * @param {string} id
     * @param {Record<string, any>} [config]
     * @returns {APIResponse<sweettooth.Extension>}
     */
    extension(id, config) {
        return GET(`/extensions/${id}`, config);
    }

    /**
     * @param {string} query
     * @param {number=} page
     * @param {number=} page_size
     * @param {string} [ordering]
     * @param {boolean=} recommended
     */
    search(query, page = 1, page_size = 25, ordering, recommended = false) {
        if (query && query != '-') {
            return GET(`/extensions/search/${query}/`, {
                params: {
                    page,
                    page_size,
                    ordering,
                    recommended,
                },
            });
        }
        else {
            return this.extensions({
                params: {
                    page,
                    page_size,
                    ordering,
                    status: constants.STATUS.ACTIVE,
                }
            });
        }
    }

    /**
     * @param {Record<string, number>} extensions
     * @param {string} shellVersion
     * @param {boolean} versionValidationEnabled
     */
    updates(extensions, shellVersion, versionValidationEnabled) {
        return POST('/extensions/updates/', {
            installed: extensions,
            shell_version: shellVersion,
            version_validation_enabled: versionValidationEnabled,
        });
    }
}

const server = new ServerAPI();

export default server;

