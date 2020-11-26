<template>
    <div>
        <slot
            v-if="browser.api"
            :api="browser.api"
        ></slot>
        <slot
            v-else
            name="fallback"
        ></slot>
    </div>
</template>

<script>
import { defineComponent } from '@vue/composition-api';

import { useBrowserAPI } from '../js/compositions/browser';

export default defineComponent({
    setup() {
        const { browser } = useBrowserAPI();

        return {
            browser
        }
    }
});
</script>