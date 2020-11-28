<template>
    <b-row>
        <b-col cols="3">
            <b-img :src="comment.gravatar" />
        </b-col>
        <b-col cols="9">
            <b-row>

            </b-row>

            <b-row>
                <b-col cols="auto">
                    by {{ comment.author.username }}
                </b-col>
                <b-col v-if="comment.rating && comment.rating > 0">
                    <star-rating
                        active-color="#555555"
                        border-color="#555555"
                        inactive-color="#ffffff"
                        :show-rating="false"
                        :star-size="15"
                        :read-only="true"
                        :rounded-corners="true"
                        :border-width="3"
                        :padding="5"
                        :rating="comment.rating"
                    />
                </b-col>
            </b-row>
            <b-row>
                <b-col>
                    {{ comment.comment }}
                </b-col>
            </b-row>
            <b-row>
                <!-- TODO: Format this 'normally' -->
                {{ new Date(Date.parse(comment.submit_date)).toLocaleString() }}
            </b-row>
        </b-col>

    </b-row>
</template>

<script>
import StarRating from 'vue-star-rating';

import * as types from '../types';

export default {
    components: {
        StarRating
    },
    props: {
        comment: {
            required: true,
            type: types.Comment,
        },
    },
};
</script>