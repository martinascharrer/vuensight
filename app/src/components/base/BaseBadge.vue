<template>
    <span
        class="baseBadge"
        :class="`baseBadge--${color} ${isRound ? 'baseBade--round' : ''}`"
    >
        <slot />
    </span>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

import { Color } from '@/types/index.d';

export default defineComponent({
  name: 'BaseBadge',
  props: {
    color: {
      type: String as PropType<Color>,
    },
    isRound: {
      type: Boolean,
      default: true,
    },
  },
});
</script>

<style lang="scss">
.baseBadge {
    background: var(--grey-10);
    color: var(--grey-50);
    font-size: var(--font-size--s);
    line-height: var(--spacing--l);
    padding: var(--spacing--2xs) var(--spacing--s);
    border-radius: var(--border-radius--s);

    &--round {
        border-radius: var(--border-radius--l);
    }

    &--mint {
        background: var(--mint-50);
        color: white;
    }

    &--red {
        background: var(--red-50);
        color: white;
    }

    &--purple {
        background: var(--purple-50);
        color: white;
    }

    &--light-mint {
        background: var(--mint-10);
        color: var(--mint-70);
    }

    &--light-red {
        background: var(--red-10);
        color: var(--red-70);
    }
}
</style>
