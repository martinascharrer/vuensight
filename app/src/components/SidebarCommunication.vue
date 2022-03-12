<template>
  <div class="sidebarCommunication">
      <h2>{{ component.name }}</h2>
      <p>some info about this component</p>
      <base-sub-nav :items="[
              {
                  to: '/',
                  name: 'Props',
                  color: 'mint',
                  counter: component.props.length,
                  disabled: component.props.length > 0
              },
              {
                  to: '/events',
                  name: 'Events',
                  color: 'red',
                  counter: 0,
                  disabled: component.events.length > 0
              },
              {
                  to: '/slots',
                  name: 'Slots',
                  color: 'purple',
                  counter: component.slots.length,
                  disabled: component.slots.length > 0
              }
          ]"
      />
      <router-view
          :component="component"
          @channelSelected="selectChannel"
      />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, PropType } from 'vue';

import BaseSubNav from '@/components/base/BaseSubNav.vue';

import { Prop, VueComponent } from '@/types/index.d';

export default defineComponent({
  components: {
    BaseSubNav,
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
.sidebarCommunication {
    display: flex;
    flex-direction: column;
    gap: var(--spacing--l);
    height: 100%;
}
</style>
