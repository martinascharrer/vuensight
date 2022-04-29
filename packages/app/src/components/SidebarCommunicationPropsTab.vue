<template>
  <div class="sidebarCommunicationPropsTab">
      <card-communication-channel
          v-for="prop in propsWithDependents"
          :key="prop.name"
          :channel="prop"
          :dependents="prop.dependents"
          :is-selected="prop.dependents.length > 0 && selectedChannel && selectedChannel.name === prop.name"
          color="mint"
          @click="prop.dependents.length > 0 && selectChannel(prop)"
      />
  </div>
</template>

<script lang="ts">
import {
  computed, defineComponent, ref, PropType,
} from 'vue';

import CardCommunicationChannel from '@/components/CardCommunicationChannel.vue';

import { Prop, VueComponent } from '@vuensight/types';

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
      selectedChannel.value = selectedChannel.value?.name !== channel.name ? channel : null;
      emit('channelSelected', selectedChannel.value);
    };

    const propsWithDependents = computed(() => props.component.props.map((prop, index) => ({
      ...prop,
      dependents: props.component.dependents.filter((dependent) => dependent.usedProps.includes(index)),
    })));

    return {
      propsWithDependents,
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
