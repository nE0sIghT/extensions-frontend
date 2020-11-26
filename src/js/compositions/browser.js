import { reactive, ref } from '@vue/composition-api';
import * as Browser from '../api/browser';

/** @type {{ api: Browser.API | null }} */
let browser = reactive({ api: null });
let initializing = false;

export function useBrowserAPI() {
    /** @type {import('@vue/composition-api').Ref<((api: Browser.API) => void) | null>} */
    let cb = ref(null);

    if (!browser.api && !initializing) {
        initializing = true;

        Browser.initialize().then((api) => {
            browser.api = api;

            if (cb.value) {
                cb.value(api);
            }
        }).catch(error => {
            console.error(error.message);
        });
    }

    /**
     * @param {(api: Browser.API) => void} callback
     */
    function onInitialize(callback) {
        if (browser.api) {
            callback(browser.api);
        } else {
            cb.value = callback;
        }
    }

    return { browser, onInitialize };
}