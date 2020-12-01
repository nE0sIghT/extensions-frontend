/**
 * @param {unknown} payload
 * @returns {payload is import("axios").AxiosError}
 */
export function isAxiosError(payload) {
    const error = /** @type {import("axios").AxiosError} */ (payload);
    return (typeof payload === 'object') && (error.isAxiosError === true);
}