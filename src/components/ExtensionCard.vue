<template>
  <b-card no-body class="p-2 justify-content-between position-relative">
    <div class="d-flex h-100">
      <b-card-img
        :src="extension.icon || '/images/plugin.png'"
        class="mr-auto"
        left
        width="32px"
        height="32px"
      ></b-card-img>

      <b-card-body class="flex-grow-1 pt-0">
        <router-link
          :to="`/extension/${extension.id}`"
          class="stretched-link"
        >
          <h6>{{ extension.name }}</h6>
        </router-link>
      </b-card-body>
    </div>
    <div class="d-flex flex-grow-0 text-center">
      <slot :extension="extension"></slot>
    </div>
  </b-card>
</template>

<script>
import * as types from '../types';

export default {
  props: {
    extension: types.Extension,
  },
};
</script>

<style lang='scss' scoped>
</style>
