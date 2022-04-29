<template>
    <button class="baseIconButton">
        <base-icon :icon-color="iconColor" :icon-name="iconName" :size="size">
            <slot />
        </base-icon>
    </button>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import BaseIcon from '@/components/base/BaseIcon.vue';

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
  components: {
    BaseIcon,
  },
});
</script>

<style lang="scss" scoped>
.baseIconButton {
    display: flex;
    justify-content: center;
    padding: var(--spacing--s);
}
</style>
