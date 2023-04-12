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

<script setup lang="ts">
import { computed } from 'vue';

import CardCommunicationChannel from '@/components/CardCommunicationChannel.vue';

import { Slot } from '@vuensight/types';
import useSelection from '@/hooks/useSelection';

const {
  selectedChannel,
  selectedComponent,
  updateSelectedChannel,
  updateSelectedChannelType,
} = useSelection();

updateSelectedChannelType('Slots');

const selectChannel = (channel: Slot) => {
  if (selectedChannel.value?.name !== channel.name) updateSelectedChannel(channel);
};

const slotsWithDependents = computed(() => selectedComponent.value?.slots.map((slot, index) => ({
  ...slot,
  dependents: selectedComponent.value?.dependents.filter((dependent) => dependent.usedSlots.includes(index)),
})));
</script>

<style lang="scss">
.sidebarCommunicationSlotsTab {
    display: flex;
    flex-direction: column;
    gap: var(--spacing--l);
}
</style>
