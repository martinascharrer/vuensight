<template>
    <button
        class="baseArrowIcon"
        :class="{ 'baseArrowIcon--flipped': isFlipped }"
    >
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 15 16"
        >
            <path
                class="baseArrowIcon__arrow"
                d="M7.5 12.58a.66.66 0 0 1-.46-.19L1.18 6.53c-.25-.25-.25-.67 0-.92s.67-.25.92
                0l5.4 5.4 5.4-5.4c.25-.25.67-.25.92 0s.25.67 0 .92l-5.86 5.86a.66.66 0 0 1-.46.19z"
            />
        </svg>
    </button>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'BaseArrowIcon',
  props: {
    isFlipped: {
      type: Boolean,
      default: false,
    },
  },
});
</script>

<style lang="scss">
.baseArrowIcon {
    display: flex;
    height: 1.75rem;
    width: 1.75rem;
    padding: var(--spacing--s);
    cursor: pointer;
    transform: rotate(0deg);
    background: transparent;
    transition: background, transform 200ms ease;

    &:hover,
    &:focus {
        background: var(--grey-10);
        border-radius: var(--border-radius--2xl);
    }

    &__arrow {
        fill: var(--grey-50);
        stroke: var(--grey-50);
    }

    &--flipped {
        transform: rotate(180deg);
    }
}
</style>
