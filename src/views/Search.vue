<template>
    <b-container b-fluid='md'>
        <b-overlay
            :show="busy"
            rounded
            opacity="0.6"
            spinner-variant="primary"
        >
            <div v-if="count">
                <b-pagination-nav
                    :value="page"
                    :number-of-pages="pages"
                    :link-gen="searchLink"
                    use-router
                    align="right"
                    pills
                ></b-pagination-nav>
                <extensions-list
                    :extensions="extensions"
                ></extensions-list>
                <b-pagination-nav
                    :value="page"
                    :number-of-pages="pages"
                    :link-gen="searchLink"
                    use-router
                    align="right"
                    pills
                ></b-pagination-nav>
            </div>
            <div v-else class='text-center'>
                {{ $t("No extensions found while searching “{query}”", { query: $route.params.query }) }}
            </div>
        </b-overlay>
    </b-container>    
</template>

<script src="../js/search.js"></script>
