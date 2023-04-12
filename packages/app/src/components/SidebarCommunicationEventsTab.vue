<template>
  <div class="sidebarCommunicationPropsTab">
      <card-communication-channel
          v-for="event in eventsWithDependents"
          :key="event.name"
          :channel="event"
          :dependents="event.dependents"
          :is-selected="event.dependents.length > 0 && selectedChannel && selectedChannel.name === event.name"
          color="red"
          @click="event.dependents.length > 0 && selectChannel(event)"
      />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import CardCommunicationChannel from '@/components/CardCommunicationChannel.vue';

import {
  Event,
} from '@vuensight/types';
import useSelection from '@/hooks/useSelection';

const {
  selectedChannel,
  selectedComponent,
  updateSelectedChannel,
  updateSelectedChannelType,
} = useSelection();

updateSelectedChannelType('Events');
const selectChannel = (channel: Event) => {
  if (selectedChannel.value?.name !== channel.name) updateSelectedChannel(channel);
};

const eventsWithDependents = computed(() => selectedComponent.value?.events.map((event, index) => ({
  ...event,
  dependents: selectedComponent.value?.dependents.filter((dependent) => dependent.usedEvents.includes(index)),
})));
</script>

<style lang="scss">
.sidebarCommunicationPropsTab {
    display: flex;
    flex-direction: column;
    gap: var(--spacing--l);
}
</style>
