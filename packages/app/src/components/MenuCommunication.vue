<template>
    <div class="menuCommunication">
            <base-dropdown>
                <template #trigger="{ isOpen }">
                    Filter
                    <base-arrow-icon :is-flipped="isOpen" />
                </template>
                <div class="menuCommunication__filterForm">
                    <h4>Component size</h4>
                    <base-radio-button-group
                        v-model="nodeSizeFilterLocal"
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
                        name="nodeSizeFilter"
                    />
                </div>
            </base-dropdown>
        <label class="input" for="search">
            <input
                id="search"
                :value="search"
                class="menuCommunication__search"
                placeholder="Search for a component"
                @input="$emit('update:search', $event.target.value)"
            />
            <button @click="$emit('update:search', '')"><base-cross-icon /></button>
        </label>
    </div>
</template>

<script lang="ts">
import {
  defineComponent, ref, watch,
} from 'vue';

import BaseArrowIcon from '@/components/base/BaseArrowIcon.vue';
import BaseCrossIcon from '@/components/base/BaseCrossIcon.vue';
import BaseDropdown from '@/components/base/BaseDropdown.vue';
import BaseRadioButtonGroup from '@/components/base/BaseRadioButtonGroup.vue';

export default defineComponent({
  components: {
    BaseArrowIcon,
    BaseCrossIcon,
    BaseDropdown,
    BaseRadioButtonGroup,
  },
  props: {
    nodeSizeFilter: {
      type: String,
      default: 'props',
    },
    search: {
      type: String,
      default: '',
    },
  },
  setup(props, { emit }) {
    const nodeSizeFilterLocal = ref(props.nodeSizeFilter);
    watch(nodeSizeFilterLocal, () => {
      emit('update:nodeSizeFilter', nodeSizeFilterLocal);
    });

    return {
      nodeSizeFilterLocal,
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
