<template>
    <base-card
        class="cardCommunicationChannel"
        :class="{
            [`cardCommunicationChannel--${color}`]: color,
            'cardCommunicationChannel--selected': isSelected,
            'cardCommunicationChannel--disabled': dependents.length === 0
        }"
        :disabled="dependents.length === 0"
    >
        <template #header>
            <div class="cardCommunicationChannel__header">
                <base-check-icon
                    :color="color"
                    :is-checked="isSelected"
                    :is-disabled="dependents.length === 0"
                />
                <p>{{ channel.name }}</p>
                <base-badge>{{ dependents.length }}</base-badge>
                <base-badge :color="`light-${color}`" v-if="channel.mixin">mixin</base-badge>
            </div>
        </template>
        <template
            v-if="channel.type || channel.default || channel.required || channel.mixin"
            #body
        >
            <template v-if="channel.type">
                type: {{ channel.type.name }}
            </template>
            <template v-if="channel.default">
                <base-delimiter :color="color" /> default: {{ channel.default }}
            </template>
            <template v-if="channel.required">
                <base-delimiter :color="color" /> required: {{ channel.required }}
            </template>
            <template v-if="channel.mixin">
                <base-delimiter :color="color" /> mixin: {{ channel.mixin.name }}
            </template>
        </template>
        <template v-if="dependents.length > 0" #footer>
            used in:
            <base-list
                v-if="dependents.length > 0" :color="color"
                :items="dependents.map(dep => dep.name)"
            />
        </template>
    </base-card>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

import BaseBadge from '@/components/base/BaseBadge.vue';
import BaseCard from '@/components/base/BaseCard.vue';
import BaseCheckIcon from '@/components/base/BaseCheckIcon.vue';
import BaseDelimiter from '@/components/base/BaseDelimiter.vue';
import BaseList from '@/components/base/BaseList.vue';

import { Prop, Dependent } from '@vue-component-insight/types';
import { Color } from '@/types';

export default defineComponent({
  name: 'CardCommunicationChannel',
  props: {
    channel: {
      type: Object as PropType<Prop>,
      required: true,
    },
    dependents: {
      type: Array as PropType<Array<Dependent>>,
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
    BaseList,
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

    &--disabled {
        color: var(--grey-30);
        cursor: default;
        box-shadow: var(--box-shadow--xs);

        &:hover {
            box-shadow: var(--box-shadow--xs);
        }
    }

    &__header {
        display: flex;
        gap: var(--spacing--m);
        align-items: center;
    }
}
</style>
