<template>
    <svg class="baseCrossIcon" height="11" width="11" xmlns="http://www.w3.org/2000/svg">
        <path class="baseCrossIcon__cross" d="M2.2 1.19l3.3 3.3L8.8 1.2a.67.67 0 01.5-.2.75.75 0 01.7.7.66.66 0
        01-.2.48L6.49 5.5 9.8  8.82c.13.126.202.3.2.48a.75.75 0 01-.7.7.67.67 0 01-.5-.2L5.5 6.51 2.21 9.8a.67.67 0
        01-.5.2.75.75 0 01-.71-.71.66.66 0 01.2-.48L4.51 5.5 1.19 2.18A.66.66 0 011 1.7a.75.75 0 01.7-.7.67.67
        0 01.5.19z"/>
    </svg>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

import { Color } from '@/types';

export default defineComponent({
  name: 'BaseCheckIcon',
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
.baseCrossIcon {

    &__cross {
        fill: var(--grey-30);
    }
}
</style>
