<template>
    <button class="baseCard">
        <span class="baseCard__header" :class="{'baseCard__header--expanded': isExpanded && $slots.body}">
            <slot name="header"/>
            <base-arrow-icon v-if="$slots.body" :is-flipped="isExpanded" @click.stop="isExpanded = !isExpanded"/>
        </span>
        <transition>
            <span v-if="isExpanded && $slots.body" class="baseCard__body">
                <slot name="body" />
            </span>
        </transition>
    </button>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

import BaseArrowIcon from '@/components/base/BaseArrowIcon.vue';

export default defineComponent({
  name: 'BaseCard',
  components: {
    BaseArrowIcon,
  },
  setup() {
    const isExpanded = ref(false);
    return {
      isExpanded,
    };
  },
});
</script>

<style lang="scss">
.baseCard {
    background: white;
    border-radius: var(--border-radius--m);
    box-shadow: var(--box-shadow--s);
    display: flex;
    flex-direction: column;

    &__header {
        display: flex;
        justify-content: space-between;
        width: 100%;
        padding: var(--spacing--m) var(--spacing--l);

        &--expanded {
            border-bottom: 1px solid var(--grey-10);
        }
    }

    &__body {
        padding: var(--spacing--m) var(--spacing--l);
        font-size: var(--font-size--m);
    }

    .v-enter-active,
    .v-leave-active {
        transition: opacity 0.2s ease;
    }

    .v-enter-from,
    .v-leave-to {
        opacity: 0;
    }
}

</style>
