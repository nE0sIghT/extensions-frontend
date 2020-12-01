<template>
    <div />
</template>

<script lang="ts">
import { defineComponent, onMounted, watch } from "@vue/composition-api";
import server from "../js/api/server";
import { useRouter } from "../router/utils";

export default defineComponent({
    setup() {
        const { route, router } = useRouter();

        const lastRoute = route.value.query.from;

        const user = server.getUser();

        function redirectForUser(user: sweettooth.User | null) {
            if (user) {
                if (typeof lastRoute === "string") {
                    router.value.replace(decodeURI(lastRoute));
                } else {
                    router.value.replace("/");
                }
            }
        }

        watch(user, newUser => {
            redirectForUser(newUser);
        });

        onMounted(() => {
            if (!user.value) {
                server
                    .hello()
                    .catch(() => {});
            } else {
                redirectForUser(user.value);
            }
        });
    }
});
</script>