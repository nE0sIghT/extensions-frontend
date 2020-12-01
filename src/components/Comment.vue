<template>
    <b-row class="comment">
        <b-col cols="auto">
            <b-img :src="comment.gravatar" />
        </b-col>
        <b-col>
            <b-row>
                <b-col cols="auto">
                    <b-link :to="getProfileLink(comment.author)">
                        {{comment.author.username}}
                    </b-link>
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
                    <div>
                        <p>{{ comment.comment }}</p>
                    </div>
                    <p class="time">{{ formattedDate }}</p>
                </b-col>
            </b-row>
        </b-col>
    </b-row>
</template>

<style lang="scss" scoped>
.comment {
    margin-bottom: 5px;
}

.time {
    color: #999;
}
</style>

<script lang="ts">
import { computed, defineComponent } from "@vue/composition-api";
import StarRating from "vue-star-rating";

import * as types from "../types";

import { getProfileLink } from "../js/compositions/user";
import { getBrowserLocales } from "../js/i18n/utils";

const formatter = new Intl.DateTimeFormat(getBrowserLocales(), {
    year: "numeric",
    month: "long",
    day: "numeric"
});

export default defineComponent({
    name: "Comment",
    components: {
        StarRating
    },
    props: {
        comment: {
            required: true,
            type: types.Comment
        }
    },
    setup(props) {
        const formattedDate = computed(() => {
            const date = new Date(Date.parse(props.comment.submit_date));

            return formatter.format(date);
        });

        return {
            formattedDate,
            getProfileLink
        };
    }
});
</script>