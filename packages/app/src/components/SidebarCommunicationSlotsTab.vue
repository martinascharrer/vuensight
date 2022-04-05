<template>
  <div class="sidebarCommunicationSlotsTab">
      <card-communication-channel
          v-for="(slot, index) in component.slots"
          :key="slot.name"
          :channel="slot"
          :dependents="component.dependents.filter(dependent => dependent.usedSlots.includes(index))"
          :is-selected="selectedChannel ? selectedChannel.name === slot.name : null"
          color="purple"
          @click="selectChannel(slot)"
      />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, PropType } from 'vue';

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
    return {
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
