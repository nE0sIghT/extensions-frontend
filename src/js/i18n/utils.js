import { getCurrentInstance, reactive, toRefs, watch } from "@vue/composition-api";

export function useI18n() {
    const instance = getCurrentInstance();

    if (!instance) {
        throw new Error('useI18n can only be called within setup().');
    }

    const $state = reactive({ t: instance.$t.bind(instance) });

    watch(() => instance.$t, t => {
        $state.t = t.bind(instance);
    });

    return { ...toRefs($state) };
}

/**
 * Returns a list of the user's language preferences and their language
 * tag as a fallback.
 * 
 * @example 
 * // Example Output.
 * ['en-US', 'en', 'es-MX', 'es']
 * 
 * @returns {string[] | undefined} List of user's language preferences.
 */
export function getBrowserLocales() {
    const navigatorLocales =
        typeof window.navigator !== 'undefined' &&
            typeof window.navigator.languages !== 'undefined'
            // If window.navigator.languages is defined use it.
            ? [...Array.from(window.navigator.languages)]
            // Fallback on window.navigator.language otherwise.
            : window.navigator.language
                ? [window.navigator.language]
                : undefined;


    if (!navigatorLocales) {
        return undefined;
    }

    /** @type {string[]} */
    let locales = [];

    for (let locale of navigatorLocales) {
        // Add the full locale and only the language tag.
        locales.push(locale.trim(), locale.trim().split(/-|_/)[0]);
    }

    return locales;
}