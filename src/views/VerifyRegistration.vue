<template>
    <div>
        <p v-if="!invalid">Verifying Registration...</p>
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
            signature = null,
            timestamp = null
        } = query;

        if (
            typeof user_id !== "string" ||
            typeof signature !== "string" ||
            typeof timestamp !== "string"
        ) {
            $state.invalid = true;
            return { ...toRefs($state) };
        }

        server.verifyUser(user_id, timestamp, signature).then((res) => {
            console.log(res);
            
            router.value.push('/login/');
        }).catch(err => console.log(err));

        return { ...toRefs($state) };
    }
});
</script>