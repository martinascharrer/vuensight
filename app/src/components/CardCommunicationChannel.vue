<template>
    <base-card
        class="cardCommunicationChannel"
        :class="{
            [`cardCommunicationChannel--${color}`]: color,
            'cardCommunicationChannel--selected': isSelected
        }"
    >
        <template #header>
            <div class="cardCommunicationChannel__header">
                <base-check-icon
                    :color="color"
                    :is-checked="isSelected"
                > </base-check-icon>
                <p>{{ channel.name }}</p>
                <base-badge>3</base-badge>
                <base-badge :color="`light-${color}`" v-if="channel.mixin">mixin</base-badge>
            </div>
        </template>
        <template v-if="channel.type">
            type: {{ channel.type.name }}
        </template>
        <template v-if="channel.default">
            <base-delimiter /> default: {{ channel.default }}
        </template>
        <template v-if="channel.required">
            <base-delimiter /> required: {{ channel.required }}
        </template>
        <div v-if="channel.mixin">
            mixin: {{ channel.mixin.name }}
        </div>
    </base-card>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

import BaseBadge from '@/components/base/BaseBadge.vue';
import BaseCard from '@/components/base/BaseCard.vue';
import BaseCheckIcon from '@/components/base/BaseCheckIcon.vue';
import BaseDelimiter from '@/components/base/BaseDelimiter.vue';

import { Color, Prop } from '@/types/index.d';

export default defineComponent({
  name: 'CardCommunicationChannel',
  props: {
    channel: {
      type: Object as PropType<Prop>,
      required: true,
    },
    color: {
      type: String as PropType<Color>,
      default: 'mint',
    },
    isSelected: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    BaseBadge,
    BaseCard,
    BaseCheckIcon,
    BaseDelimiter,
  },
});
</script>

<style lang="scss">
.cardCommunicationChannel {
    cursor: pointer;

    &--mint.cardCommunicationChannel--selected {
        outline: 2px solid var(--mint-50);
    }

    &--red.cardCommunicationChannel--selected {
        outline: 2px solid var(--red-50);
    }

    &--purple.cardCommunicationChannel--selected {
        outline: 2px solid var(--purple-50);
    }

    &:hover {
        box-shadow: var(--box-shadow--m);
    }

    &__header {
        display: flex;
        gap: var(--spacing--m);
        align-items: center;
    }
}
</style>
