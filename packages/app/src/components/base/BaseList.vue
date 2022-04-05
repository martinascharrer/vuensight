<template>
    <ul
        :class="{
            [`baseList--${color}`]: color,
        }"
        class="baseList"
    >
        <li
            v-for="item in items"
            :key="item"
            class="baseList__item"
        >
            <span class="baseList__itemText">{{ item }}</span>
        </li>
    </ul>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

import { Color } from '@/types';

export default defineComponent({
  name: 'BaseDelimiter',
  props: {
    items: {
      type: Array,
      default: () => [],
    },
    color: {
      type: String as PropType<Color>,
    },
  },
});
</script>

<style lang="scss">
.baseList {
    list-style: none; /* Remove default bullets */
    padding-inline-start: var(--spacing--xl);

    &__item {
        display: flex;
    }

    &__item::before {
        content: "\2022";
        font-weight: bold;
        color: var(--navy-90);
        display: inline-block;
        width: 1em;
        margin-left: -1em;
    }

    &--mint .baseList__item::before {
        color: var(--mint-50);
    }

    &--red .baseList__item::before {
        color: var(--red-50);
    }

    &--purple .baseList__item::before {
        color: var(--purple-50);
    }

    &__itemText {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
}
</style>
