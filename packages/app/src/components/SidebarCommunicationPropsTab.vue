<template>
  <div class="sidebarCommunicationPropsTab">
      <card-communication-channel
          v-for="(prop, index) in component.props"
          :key="prop.name"
          :channel="prop"
          :dependents="component.dependents.filter(dependent => dependent.usedProps.includes(index))"
          :is-selected="selectedChannel ? selectedChannel.name === prop.name : null"
          color="mint"
          @click="selectChannel(prop)"
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
.sidebarCommunicationPropsTab {
    display: flex;
    flex-direction: column;
    gap: var(--spacing--l);
}
</style>
