<template>
    <div>
        <p v-if="!invalid">Verifying Email...</p>
        <p v-else>Invalid parameters!</p>
    </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from "@vue/composition-api";

import server from "../js/api/server";

import { useRouter } from "../router/utils";

export default defineComponent({
    setup() {
        const { route, router } = useRouter();
        const { query } = route.value;

        const $state = reactive({ invalid: false });

        const {
            user_id = null,
            email = null,
            signature = null,
            timestamp = null
        } = query;

        if (
            typeof user_id !== "string" ||
            typeof email !== "string" ||
            typeof signature !== "string" ||
            typeof timestamp !== "string"
        ) {
            $state.invalid = true;
            return { ...toRefs($state) };
        }

        server.verifyEmail(user_id, email, timestamp, signature).then((res) => {
            console.log(res);

            router.value.push('/login/');
        }).catch(err => console.log(err));

        return { ...toRefs($state) };
    }
});
</script>