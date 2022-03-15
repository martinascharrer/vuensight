<template>
    <div
        class="baseDropdown"
        :class="{'c-appDropdown--open': open}"
    >
        <button
            class="baseDropdown__trigger"
            @click="toggle"
        >
            <slot name="trigger"/>
        </button>
        <div
            v-if="open"
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
    const open = ref<boolean>(false);

    const toggle = () => {
      open.value = !open.value;
    };

    const close = () => {
      open.value = false;
    };

    return {
      close,
      open,
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

    &__trigger,
    &__content {
        background: white;
        border-radius: var(--border-radius--s);
        box-shadow: var(--box-shadow--s);
    }

    &__trigger {
        display: flex;
        gap: var(--spacing--m);
        min-width: var(--spacing--2xl);
        padding: var(--spacing--xs) var(--spacing--m);

        &:hover,
        &:focus {
            outline: 2px solid var(--yellow-30);
        }
    }

    &__content {
        padding: var(--spacing--m);
    }
}
</style>
