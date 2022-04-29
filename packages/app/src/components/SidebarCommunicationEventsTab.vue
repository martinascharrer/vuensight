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

<script lang="ts">
import {
  computed, defineComponent, ref, PropType,
} from 'vue';

import CardCommunicationChannel from '@/components/CardCommunicationChannel.vue';

import { Event, VueComponent } from '@vuensight/types';

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
    const selectedChannel = ref<Event | null>(null);
    const selectChannel = (channel: Event) => {
      console.log('event', selectedChannel.value?.name, channel.name);
      selectedChannel.value = selectedChannel.value?.name !== channel.name ? channel : null;
      emit('channelSelected', selectedChannel.value);
    };

    const eventsWithDependents = computed(() => props.component.events.map((event, index) => ({
      ...event,
      dependents: props.component.dependents.filter((dependent) => dependent.usedEvents.includes(index)),
    })));

    return {
      eventsWithDependents,
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
