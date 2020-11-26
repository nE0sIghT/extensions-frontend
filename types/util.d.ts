declare type OptionsPropType<T> = import('vue').PropType<T>;
declare type CompositionPropType<T> = import('@vue/composition-api').PropType<T>;
declare type PropType<T> = OptionsPropType<T> & CompositionPropType<T>;

declare type Await<T> = T extends PromiseLike<infer U> ? U : unknown;
