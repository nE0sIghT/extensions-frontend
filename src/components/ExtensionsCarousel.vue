<template>
    <b-carousel
        class="extensions-carousel"
        controls
        indicators
    >
        <b-link
            v-for="extension in extensions"
            :key="extension.id"
            :to="`/extension/${extension.id}`"
        >
            <b-carousel-slide
                :caption="getCaption(extension)"
                :text="getText(extension)"
            >
                <template v-slot:img>
                    <div class="d-none d-lg-block w-100 text-center">
                        <img
                            v-if="extension.screenshots.length > 0"
                            class="promo-image large-image"
                            :src="extension.screenshots[0]"
                            :alt="extension.name"
                        />
                        <div
                            v-else
                            class="d-inline-block promo-image large-image promo-block"
                        ></div>
                    </div>
                    <div class="d-block d-lg-none w-100 text-center">
                        <img
                            v-if="extension.imagePromoMiddle"
                            class="promo-image middle-image"
                            :src="extension.imagePromoMiddle"
                            :alt="extension.name"
                        />
                        <div
                            v-else
                            class="d-inline-block promo-image middle-image promo-block"
                        ></div>
                    </div>
                </template>
            </b-carousel-slide>
        </b-link>
    </b-carousel>
</template>

<script>
import * as types from '../types';

export default {
    props: {
        extensions: types.Extensions
    },

    methods: {
        // TODO: reverse promoTextEnabled
        /**
         * @param {sweettooth.Extension} extension
         */
        getCaption(extension) {
            return !extension.promoTextEnabled && extension.name;
        },

        /**
         * @param {sweettooth.Extension} extension
         */
        getText(extension) {
            // TODO: char-limited promo description!!
            return !extension.promoTextEnabled && extension.description;
        }
    }
};
</script>

<style lang='scss'>
$extensions_carousel_large_width: 680px;
$extensions_carousel_middle_width: 450px;
$extensions_carousel_height: 272px;

.extensions-carousel {
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