<template>
    <div
        class="baseDropdown"
        :class="{'c-appDropdown--open': isOpen}"
    >
        <button class="input" @click="toggle">
            <slot :isOpen="isOpen" name="trigger"/>
        </button>
        <div
            v-if="isOpen"
            class="baseDropdown__content"
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

    &__content {
        padding: var(--spacing--m);
        position: absolute;
        top: calc(var(--spacing--3xl) + var(--spacing--m));
        margin-top: var(--spacing--m);
        background: white;
        border: none;
        border-radius: var(--border-radius--s);
        box-shadow: var(--box-shadow--s);
    }
}
</style>
