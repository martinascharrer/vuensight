<template>
    <span
        :class="{
            [`baseDelimiter--${color}`]: color,
        }"
        class="baseDelimiter"
    >
       &bull;
    </span>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

import { Color } from '@/types/color';

export default defineComponent({
  name: 'BaseDelimiter',
  props: {
    color: {
      type: String as PropType<Color>,
    },
  },
});
</script>

<style lang="scss">
.baseDelimiter {
    font-weight: bold;
    color: var(--navy-90);

    &--mint {
        color: var(--mint-50);
    }

    &--red {
        color: var(--red-50);
    }

    &--purple {
        color: var(--purple-50);
    }
}
</style>
