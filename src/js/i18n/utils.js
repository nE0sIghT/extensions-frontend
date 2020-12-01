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