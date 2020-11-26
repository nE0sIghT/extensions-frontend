<template>
  <b-row>
    <b-col cols="3">
      <b-img :src="comment.gravatar" />
    </b-col>
    <b-col cols="9">
      <b-row>
       
      </b-row>
      <b-row>
        {{ comment.comment }}
      </b-row>
       <b-row>
        {{ comment.author.username }}
      </b-row>
      <b-row>
        <!-- TODO: Format this 'normally' -->
        {{ new Date(Date.parse(comment.submit_date)).toLocaleString() }}
      </b-row>
    </b-col>
  </b-row>
</template>

<script>
import * as types from '../types';

export default {
  props: {
    comment: {
      required: true,
      type: types.Comment,
    },
  },
};
</script>