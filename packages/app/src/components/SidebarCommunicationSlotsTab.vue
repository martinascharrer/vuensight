<template>
  <div class="sidebarCommunicationSlotsTab">
      <card-communication-channel
          v-for="slot in slotsWithDependents"
          :key="slot.name"
          :channel="slot"
          :dependents="slot.dependents"
          :is-selected="slot.dependents.length > 0 && selectedChannel && selectedChannel.name === slot.name"
          color="purple"
          @click="slot.dependents.length > 0 && selectChannel(slot)"
      />
  </div>
</template>

<script lang="ts">
import {
  computed, defineComponent, ref, PropType,
} from 'vue';

import CardCommunicationChannel from '@/components/CardCommunicationChannel.vue';

import { Prop, VueComponent } from '@vue-component-insight/types';

export default defineComponent({
  components: {
    CardCommunicationChannel,
  },
  props: {
    component: {
      type: Object as PropType<VueComponent>,
      required: true,
    },
  },
  setup(props, { emit }) {
    const selectedChannel = ref<Prop | null>(null);
    const selectChannel = (channel: Prop) => {
      selectedChannel.value = channel;
      emit('channelSelected', selectedChannel.value);
    };

    const slotsWithDependents = computed(() => props.component.slots.map((slot, index) => ({
      ...slot,
      dependents: props.component.dependents.filter((dependent) => dependent.usedSlots.includes(index)),
    })));

    return {
      slotsWithDependents,
      selectChannel,
      selectedChannel,
    };
  },
});
</script>

<style lang="scss">
.sidebarCommunicationSlotsTab {
    display: flex;
    flex-direction: column;
    gap: var(--spacing--l);
}
</style>
