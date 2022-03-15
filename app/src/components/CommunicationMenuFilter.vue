<template>
    <base-dropdown class="communicationMenuFilter">
        <template #trigger>
            Filter
            <base-arrow-icon />
        </template>
        <div class="communicationMenuFilter__form">
            <h4>Component size</h4>
            <base-radio-button-group
                v-model="nodeSizeFilter"
                name="nodeSizeFilter"
                :options="[
                {
                    label: 'Number of Props',
                    value: 'props',
                },
                {
                    label: 'Number of Events',
                    value: 'events',
                },
                {
                    label: 'Number of Slots',
                    value: 'slots',
                },
                {
                    label: 'Number of Props, Events & Slots',
                    value: 'all',
                },
                {
                    label: 'No filter',
                    value: 'none',
                },
            ]"
            />
        </div>
    </base-dropdown>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';

import BaseArrowIcon from '@/components/base/BaseArrowIcon.vue';
import BaseDropdown from '@/components/base/BaseDropdown.vue';
import BaseRadioButtonGroup from '@/components/base/BaseRadioButtonGroup.vue';

export default defineComponent({
  components: {
    BaseArrowIcon,
    BaseDropdown,
    BaseRadioButtonGroup,
  },
  props: {
    modelValue: {
      type: String,
      default: 'props',
    },
  },
  setup(props, { emit }) {
    const nodeSizeFilter = ref(props.modelValue);
    watch(nodeSizeFilter, () => {
      emit('update:modelValue', nodeSizeFilter.value);
    });

    return {
      nodeSizeFilter,
    };
  },
});
</script>
<style lang="scss">
.communicationMenuFilter {
    &__form {
        display: flex;
        flex-direction: column;
        gap: var(--spacing--m);
    }
}
</style>
