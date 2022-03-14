<template>
    <nav
        class="baseSubNav"
    >
        <router-link
            v-for="item in items"
            :key="item.name"
            :to="item.to"
            :disabled="item.disabled"
            :class="`baseSubNav__item baseSubNav__item--${item.color}`"
            @click="$emit('navChanged', item.name)"
        >
            <span class="baseSubNav__itemText">
                <base-badge
                    v-if="item.counter !== undefined"
                    is-round
                    :color="item.color"
                >
                    {{ item.counter }}
                </base-badge>
                {{ item.name }}
            </span>
        </router-link>
    </nav>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

import BaseBadge from '@/components/base/BaseBadge.vue';

type SubNavItem = {
    to: string,
    name: string,
    counter?: number,
    disabled?: boolean,
}

export default defineComponent({
  components: {
    BaseBadge,
  },
  props: {
    items: {
      type: Object as () => PropType<SubNavItem[]>,
      required: true,
    },
  },
});
</script>

<style lang="scss">
.baseSubNav {
    display: flex;
    gap: var(--spacing--s);
    text-decoration: none;
    border-bottom: 1px solid var(--grey-10);

    &__item {
        display: flex;
        gap: var(--spacing--xs);
        color: var(--navy-90);
        text-decoration: none;
        transition: border-color, background-color, font-weight 200ms ease;
        border-bottom: 3px solid transparent;

        &:hover {
            .baseSubNav__itemText {
                background: var(--grey-10);
                border-radius: var(--border-radius--s);
            }
        }

        &--mint.router-link-exact-active {
            border-color: var(--mint-50);
        }

        &--red.router-link-exact-active {
            border-color: var(--red-50);
        }

        &--purple.router-link-exact-active {
            border-color: var(--purple-50);
        }

        &:active {
            color: var(--navy-90);
        }
    }

    &__itemText {
        padding: var(--spacing--m) var(--spacing--s);
    }
}
</style>
