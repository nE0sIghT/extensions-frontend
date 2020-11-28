import { getCurrentInstance, reactive, watch, toRefs } from '@vue/composition-api';

export function useRoute() {
    const instance = getCurrentInstance();

    if (!instance) {
        throw new Error('No Vue instance mounted.');
    }

    const { $router } = instance;

    if (!$router) {
        throw new Error('Vue Router is not initialized or mounted on this component.');
    }

    const state = reactive({
        route: instance.$route
    });

    watch(() => instance.$route, (route) => state.route = route);

    return { ...toRefs(state) };
}