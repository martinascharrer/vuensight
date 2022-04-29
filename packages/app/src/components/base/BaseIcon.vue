<template>
    <svg :aria-labelledby="iconName"
         :class="`baseIcon baseIcon--${size}`"
         role="presentation"
         viewBox="0 0 18 18"
         xmlns="http://www.w3.org/2000/svg"
    >
        <title :id="iconName" lang="en">{{iconName}} icon</title>
        <g :fill="`var(--${iconColor})`">
            <slot />
        </g>
    </svg>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    iconName: {
      type: String,
      default: 'box',
    },
    size: {
      type: String,
      default: 'm',
    },
    iconColor: {
      type: String,
      default: 'grey-30',
    },
  },
});
</script>

<style lang="scss" scoped>
.baseIcon {
    display: inline-block;
    vertical-align: baseline;

    &--xs {
        width: var(--icon--xs);
        height: var(--icon--xs);
    }

    &--s {
        width: var(--icon--s);
        height: var(--icon--s);
    }

    &--m {
        width: var(--icon--m);
        height: var(--icon--m);
    }

    &--l {
        width: var(--icon--l);
        height: var(--icon--l);
    }

    &--xl {
        width: var(--icon--xl);
        height: var(--icon--xl);
    }

}
</style>
