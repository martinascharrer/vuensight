<template>
    <div class="menuCommunication">
            <base-dropdown>
                <template #trigger="{ isOpen }">
                    <base-icon icon-name="node size filter">
                        <icon-filter />
                    </base-icon>
                    {{ nodeSizeFilterLocal.label }}
                    <base-arrow-icon :is-flipped="isOpen" />
                </template>
                <div class="menuCommunication__filterForm">
                    <h4>Component size</h4>
                    <base-radio-button-group
                        v-model="nodeSizeFilterLocal"
                        :options="[
                        {
                            label: 'Props',
                            value: nodeSizeAttributeType.PROP,
                        },
                        {
                            label: 'Events',
                            value: nodeSizeAttributeType.EVENT,
                        },
                        {
                            label: 'Slots',
                            value: nodeSizeAttributeType.SLOT,
                        },
                        {
                            label: 'Props, Events & Slots',
                            value: nodeSizeAttributeType.CHANNELS,
                        },
                        {
                            label: 'Dependencies',
                            value: nodeSizeAttributeType.DEPENDENCIES,
                        },
                        {
                            label: 'Dependents',
                            value: nodeSizeAttributeType.DEPENDENTS,
                        },
                        {
                            label: 'No filter',
                            value: nodeSizeAttributeType.NONE,
                        },
                    ]"
                        name="nodeSizeFilter"
                    />
                </div>
            </base-dropdown>
        <label class="input" for="search">
            <base-icon icon-name="search">
                <icon-search />
            </base-icon>
            <input
                id="search"
                :value="search"
                class="menuCommunication__search"
                placeholder="Search for a component"
                @input="$emit('update:search', $event.target.value)"
            />
            <base-icon-button
                icon-name="cross"
                size="xs"
                @click="$emit('update:search', '')"
            >
                    <icon-cross />
            </base-icon-button>
        </label>
    </div>
</template>

<script lang="ts">
import {
  defineComponent, ref, watch,
} from 'vue';

import BaseArrowIcon from '@/components/base/BaseArrowIcon.vue';
import BaseDropdown from '@/components/base/BaseDropdown.vue';
import BaseIcon from '@/components/base/BaseIcon.vue';
import BaseIconButton from '@/components/base/BaseIconButton.vue';
import BaseRadioButtonGroup from '@/components/base/BaseRadioButtonGroup.vue';
import IconSearch from '@/components/icons/IconSearch.vue';
import IconCross from '@/components/icons/IconCross.vue';
import IconFilter from '@/components/icons/IconFilter.vue';

import nodeSizeAttributeType from '@/types/nodeSizeAttributeType';

export default defineComponent({
  components: {
    BaseArrowIcon,
    BaseIcon,
    BaseIconButton,
    BaseDropdown,
    BaseRadioButtonGroup,
    IconCross,
    IconFilter,
    IconSearch,
  },
  props: {
    nodeSizeFilter: {
      type: String,
      required: true,
    },
    search: {
      type: String,
      default: '',
    },
  },
  setup(props, { emit }) {
    const nodeSizeFilterLocal = ref({ label: 'asdf', value: props.nodeSizeFilter });
    watch(nodeSizeFilterLocal, () => {
      emit('update:nodeSizeFilter', nodeSizeFilterLocal.value.value);
    });

    return {
      nodeSizeFilterLocal,
      nodeSizeAttributeType,
    };
  },
});
</script>
<style lang="scss">
.menuCommunication {
    padding: var(--spacing--m);
    display: flex;
    gap: var(--spacing--m);

    &__filterForm {
        display: flex;
        flex-direction: column;
        gap: var(--spacing--m);
    }

    &__search {
        min-width: 15rem;
    }
}
</style>
