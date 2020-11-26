<template>
  <b-carousel
    class="screenshot-carousel"
    :controls="screenshots.length > 1"
    :indicators="screenshots.length > 1"
  >
    <!-- TODO: Store screenshot alt content for accessibility -->
    <b-carousel-slide
      v-for="(screenshot, index) of screenshots"
      :key="index"
      :img-src="screenshot.screenshot"
      :img-alt="screenshot.alttext || 'Extension Screenshot'"
    />
  </b-carousel>
</template>

<script>
import * as types from '../types';

export default {
  props: {
    screenshots: types.Screenshots,
  },
};
</script>

<style lang='scss'>
$extensions_carousel_large_width: 680px;
$extensions_carousel_middle_width: 450px;
$extensions_carousel_height: 272px;

.screenshot-carousel {
  text-shadow: 0 0 0.8rem #000;

  .promo-image {
    height: $extensions_carousel_height;
  }

  .middle-image {
    width: $extensions_carousel_middle_width;
  }

  .large-image {
    width: $extensions_carousel_large_width;
  }

  .promo-block {
    background-color: #ababab;
  }

  .carousel-caption {
    max-width: $extensions_carousel_large_width;
    padding: 0 1rem;
    margin: 0 auto;

    > h3 {
      color: #fff;
    }
  }
}
</style>