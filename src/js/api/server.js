import Cookie from 'universal-cookie';
import axios from 'axios'
import qs from "qs"

import { reactive, toRef } from '@vue/composition-api';

import * as constants from '../constants'

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

async function ensureCSRF() {
    const cookie = new Cookie();

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

/**
 * @typedef {object} RegistrationInfo
 * @property {string} email
 * @property {string} username
 * @property {string} password
 * @property {string} passwordConfirm
 */

class ServerAPI {
    constructor() {
        this._authState = reactive({
            /** @type {sweettooth.User | null} */
            user: null
        });
    }

    /**
     * @returns {import('@vue/composition-api').Ref<sweettooth.User | null>}
     */
    getUser() {
        return toRef(this._authState, 'user');
    }

    async hello() {
        const { data } = await GET('/hello/');

        if (data.user && data.user.id != null) {
            this._authState.user = data.user;
        }

        return this._authState;
    }

    /**
     * @param {RegistrationInfo} info
     */
    register(info) {
        const { username, email, password, passwordConfirm } = info;

        return POST('/accounts/register/', {
            username,
            email,
            password,
            password_confirm: passwordConfirm
        });
    }

    /**
     * @param {string} userId
     * @param {string} email
     * @param {string} timestamp
     * @param {string} signature
     */
    verifyEmail(userId, email, timestamp, signature) {
        return POST('/accounts/verify-email/', {
            user_id: `${userId}`,
            email,
            timestamp,
            signature
        });
    }

    /**
     * @param {string} userId
     * @param {string} timestamp
     * @param {string} signature
     */
    verifyUser(userId, timestamp, signature) {
        return POST('/accounts/verify-registration/', {
            user_id: `${userId}`,
            timestamp,
            signature
        })
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
        this._authState.user = null;

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

