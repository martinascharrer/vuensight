<template>
    <span class="baseDelimiter">
       &#9679;
    </span>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'BaseDelimiter',
  setup() {
    const isExpanded = ref(false);
    return {
      isExpanded,
    };
  },
});
</script>

<style lang="scss">
.baseDelimiter {
    color: var(--mint-50);
}
</style>
