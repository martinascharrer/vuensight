<template>
  <div class="sidebarCommunication">
      <h2>{{ component.name }}</h2>
      <p>some info about this component</p>
      <card-communication-channel
          v-for="prop in component.props"
          :key="prop.name"
          :channel="prop"
          @click="$emit('channelSelected', prop);"
      />
  </div>
</template>

<script>
import { defineComponent } from 'vue';

import CardCommunicationChannel from '@/components/CardCommunicationChannel.vue';

export default defineComponent({
  name: 'SidebarCommunication',
  components: {
    CardCommunicationChannel,
  },
  props: {
    component: {
      type: Object,
      required: true,
    },
  },
});
</script>

<style lang="scss">
.sidebarCommunication {
    display: flex;
    flex-direction: column;
    gap: var(--spacing--m);
    height: 100%;
}
</style>
