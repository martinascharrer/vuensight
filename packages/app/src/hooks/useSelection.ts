import { ref } from 'vue';
import { Channel, ChannelType, VueComponent } from '@vuensight/types';

const selectedChannel = ref<Channel | null>(null);
const selectedChannelType = ref<ChannelType>('Props');
const selectedComponent = ref<VueComponent | null>(null);

export default () => {
  const updateSelectedChannel = (channel: Channel) => {
    selectedChannel.value = channel;
  };

  const updateSelectedChannelType = (channelType: ChannelType) => {
    selectedChannelType.value = channelType;
  };

  const updateSelectedComponent = (component: VueComponent) => {
    selectedComponent.value = component;
  };

  return {
    selectedChannel,
    selectedChannelType,
    selectedComponent,
    updateSelectedChannel,
    updateSelectedChannelType,
    updateSelectedComponent,
  };
};
