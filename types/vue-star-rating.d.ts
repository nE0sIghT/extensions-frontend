declare module "vue-star-rating" {
    import Vue from "vue";

    export class StarRating extends Vue {
        // The rating increment, for example pass 0.5 for half stars or 0.01 for fluid stars. Expects a number between 0.01 - 1.
        increment: number;
        // The initial rating, this will automatically round to the closest increment, so for the most accurate rating pass 0.01 as increment or set the round-start-rating prop to false
        rating: number;
        // The maximum rating, this lets vue-star-rating know how many stars to display
        maxRating: number;
        // The points defining a custom star shape. If no points are passed the default star shape is used.
        starPoints: [number, number][];
        // When set to true, the rating cannot be edited. Use in conjuction with increment to define rounding precision.
        readOnly: boolean;
        // Whether or not to show the rating next to the stars
        showRating: boolean;
        // Specify a fixed number of digits after the decimal point.
        fixedPoints: number;
        // Pass true to display star rating using rtl (right-to-left)
        rtl: boolean;
        // Pass false if you don't want the start rating value to round to the closest increment. The user will still only be able to select based on the given increment.
        roundStartRating: boolean;
        // When set to true a second click on the same rating clears the rating
        clearable: boolean;
        // When set to true only apply active colors when the user clicks the star, rather than on mouseover.
        activeOnClick: boolean;
    }

    export default StarRating;
}