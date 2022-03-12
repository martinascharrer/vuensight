<template>
    <span
        class="baseBadge"
        :class="{ 'baseBadge--mint': mint }"
    >
        <slot />
    </span>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'BaseBadge',
  props: {
    mint: {
      type: Boolean,
      default: false,
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

    &--mint {
        background: var(--mint-10);
        color: var(--mint-70);
    }
}
</style>
