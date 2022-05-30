<template>
    <div class='extension-toggle'>
        <div :checked="checked" @click="$emit('click', !checked)" class="toggle" :class="{'on' : checked}" ></div>
    </div>
</template>

<script>
    export default {
        model: {
            prop: 'checked',
            event: 'click',
        },

        props: {
            checked: Boolean
        },
    }
</script>

<style lang='scss' scoped>
$extension-toggle-width: 54px;
$extension-toggle-height: 32px;
$extension-toggle-circle-width: 8px;
$extension-toggle-color: #4a86cf;
$extension-toggle-off-color: #bbb;

.extension-toggle {
    .toggle {
        cursor: pointer;
        width: $extension-toggle-width;
        height: $extension-toggle-height;
        border-radius: calc($extension-toggle-height / 2);
        box-sizing: border-box;
        border: 2px solid $extension-toggle-off-color;
        position: relative;
        padding: 2px;
        transition: border-color .25s, background-color .25s;
    
        &:before {
            content: "";
            width: $extension-toggle-height - $extension-toggle-circle-width;
            height: $extension-toggle-height - $extension-toggle-circle-width;
            border-radius: 50%;
            display: block;
            background: $extension-toggle-off-color;
            transition: background-color .25s, background-color .25s, transform .25s;
        }
    
        &.on {
            border-color: $extension-toggle-color;
            background-color: $extension-toggle-color;
            width: $extension-toggle-width;
            height: $extension-toggle-height;
            &:before {
                background: #fff;
                transform: translateX(calc(($extension-toggle-width - $extension-toggle-circle-width) / 2))
            }
        }
    }
}

.extension-toggle:hover {
    filter: brightness(125%);
}
</style>
