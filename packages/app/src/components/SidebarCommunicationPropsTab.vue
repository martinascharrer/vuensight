<template>
  <div class="sidebarCommunicationPropsTab">
      <card-communication-channel
          v-for="prop in propsWithDependents"
          :key="prop.name"
          :channel="prop"
          :dependents="prop.dependents"
          :is-selected="prop.dependents.length > 0 && selectedChannel?.name === prop.name"
          color="mint"
          @click="prop.dependents.length > 0 && selectChannel(prop)"
      />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import CardCommunicationChannel from '@/components/CardCommunicationChannel.vue';
import { Prop } from '@vuensight/types';
import useSelection from '@/hooks/useSelection';

const {
  selectedChannel,
  selectedComponent,
  updateSelectedChannel,
  updateSelectedChannelType,
} = useSelection();

updateSelectedChannelType('Props');
const selectChannel = (channel: Prop) => {
  if (selectedChannel.value?.name !== channel.name) updateSelectedChannel(channel);
};

const propsWithDependents = computed(() => selectedComponent.value?.props.map((prop, index) => ({
  ...prop,
  dependents: selectedComponent.value?.dependents.filter((dependent) => dependent.usedProps.includes(index)),
})));
</script>

<style lang="scss">
.sidebarCommunicationPropsTab {
    display: flex;
    flex-direction: column;
    gap: var(--spacing--l);
}
</style>
