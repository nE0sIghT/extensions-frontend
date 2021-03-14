<template>
    <b-link v-if='user' :to='getProfileURL(user)'>{{ user.username }}</b-link>
    <span v-else>unknown</span>
</template>

<script>
export default {
    methods: {
        getProfileURL(user) {
            return user?.username && `/profile/${user.username}` || '#';
        },
    },

    props: {
        user: Object,
    }
};
</script>

<style lang='scss' scoped>
</style>
