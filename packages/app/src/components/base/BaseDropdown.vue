<template>
    <div
        class="baseDropdown"
        :class="{'c-appDropdown--open': isOpen}"
    >
        <button
            class="input baseDropdown__trigger"
            @click="toggle"
        >
            <slot :isOpen="isOpen" name="trigger"/>
        </button>
        <div
            v-if="isOpen"
            class="input baseDropdown__content"
        >
            <slot :close="close"/>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  setup() {
    const isOpen = ref<boolean>(false);

    const toggle = () => {
      isOpen.value = !isOpen.value;
    };

    const close = () => {
      isOpen.value = false;
    };

    return {
      close,
      isOpen,
      toggle,
    };
  },
});
</script>
<style lang="scss">
.baseDropdown {
    display: flex;
    flex-direction: column;
    align-items: start;
    gap: var(--spacing--m);
    cursor: pointer;

    &__trigger {
        display: flex;
        gap: var(--spacing--m);
        min-width: var(--spacing--2xl);
        padding: var(--spacing--xs) var(--spacing--m);
    }

    &__content {
        padding: var(--spacing--m);
    }
}
</style>
