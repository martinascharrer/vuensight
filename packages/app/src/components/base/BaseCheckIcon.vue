<template>
    <svg
        class="baseCheckIcon"
        :class="{
            [`baseCheckIcon--${color}`]: color,
            'baseCheckIcon--selected': isChecked
        }"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 12.19 18"
    >
        <path
            class="baseCheckIcon__check"
            d="M4.7 12.83a1 1 0 0 1-.71-.3L1.3 9.81c-.39-.4-.38-1.03.01-1.42.39-.38 1.03-.38
            1.41.01l1.97 1.99 4.77-4.92a.987.987 0 0 1 1.41-.02c.4.38.41 1.02.02 1.41l-5.48
            5.65c-.18.2-.48.29-.71.32z"
        />
    </svg>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

import { Color } from '@/types';

export default defineComponent({
  props: {
    isChecked: {
      type: Boolean,
      default: false,
    },
    color: {
      type: String as PropType<Color>,
      default: 'mint',
    },
  },
});
</script>

<style lang="scss">
.baseCheckIcon {
    height: 1.5rem;
    width: 1.5rem;
    border-radius: var(--border-radius--l);
    background: var(--grey-10);

    &__check {
        fill: var(--grey-50);
    }

    &--selected {
        .baseCheckIcon__check {
            fill: white;
        }
    }

    &--mint.baseCheckIcon--selected {
        background: var(--mint-50);
    }

    &--red.baseCheckIcon--selected {
        background: var(--red-50);
    }

    &--purple.baseCheckIcon--selected {
        background: var(--purple-50);
    }
}
</style>
