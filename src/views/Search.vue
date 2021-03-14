<template>
    <b-container b-fluid='md'>
        <b-row>
            <b-col md='3' class='border rounded'>
                <b-form class='search-form pt-3 pb-3' @submit="onSubmit">
                    <b-form-group>
                        <b-form-input
                            v-model="search.text"
                            :placeholder="$t('Search extensions…')"
                        ></b-form-input>
                    </b-form-group>
                    <b-form-group :label="$t('Filter')" label-class="font-weight-bold">
                        <b-form-checkbox
                            v-model="search.recommended"
                        >
                            {{ $t('Recommended') }}
                        </b-form-checkbox>
                    </b-form-group>
                    <b-form-group :label="$t('Sort by')" label-class="font-weight-bold">
                        <b-form-radio-group
                            v-model="search.ordering"
                            name="ordering"
                            :options="search.orderingOptions"
                            stacked
                        ></b-form-radio-group>
                    </b-form-group>
                    <b-form-group :label="$t('Sort direction')" label-class="font-weight-bold">
                        <b-form-radio-group
                            v-model="search.direction"
                            name="direction"
                            :options="search.directionOptions"
                            stacked
                        ></b-form-radio-group>
                    </b-form-group>
                    <b-form-group :label="$t('Page size')" label-class="font-weight-bold">
                        <b-form-select v-model="search.page_size" :options="Array.from({ length: 20 }, (x, i) => (i + 1) * 5)"></b-form-select>
                    </b-form-group>

                    <b-button variant="primary" type='submit'>{{ $t('Search') }}</b-button>
                </b-form>
            </b-col>
            <b-col md='9'>
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
                            show-rating
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
            </b-col>
        </b-row>
    </b-container>    
</template>

<script src="../js/search.js"></script>
