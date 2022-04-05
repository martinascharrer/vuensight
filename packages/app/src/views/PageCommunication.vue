<template>
    <layout-split-view>
        <p v-if="isLoading">... loading</p>
        <p v-else-if="isError">Something went wrong parsing your project.</p>
        <template v-else-if="forceGraphData">
            <menu-communication
                v-model:node-size-filter="nodeSizeFilter"
                v-model:search="componentSearch"
                class="pageCommunication__menu"
            />
            <force-graph
                :selected-channel="selectedChannel"
                :selected-channel-type="selectedChannelType"
                :data="forceGraphData"
                :node-size-attribute="nodeSizeFilter"
                :search-string="componentSearch"
                @selected="selectedComponent = $event"
                @unselected="selectedComponent = null"
            />
        </template>
        <template #aside>
            <sidebar-communication
                v-if="selectedComponent"
                :component="selectedComponent"
                @channelSelected="selectedChannel = $event"
            />
            <p v-else>Select a component!</p>
        </template>
    </layout-split-view>
</template>

<script lang="ts">
import {
  defineComponent,
  ComputedRef,
  computed,
  ref,
} from 'vue';
import { useRoute } from 'vue-router';

import * as parserService from '@/services/parser';

import ForceGraph from '@/components/ForceGraph.vue';
import LayoutSplitView from '@/components/layout/LayoutSplitView.vue';
import MenuCommunication from '@/components/MenuCommunication.vue';
import SidebarCommunication from '@/components/SidebarCommunication.vue';

import { useFetch } from '@/composables/fetch';

import {
  VueComponent, Dependency, Prop,
} from '@vue-component-insight/types';
import {
  ForceLayout, Link,
} from '@/types';

export default defineComponent({
  name: 'PageCommunication',
  components: {
    ForceGraph,
    LayoutSplitView,
    MenuCommunication,
    SidebarCommunication,
  },
  setup() {
    const {
      data,
      get: getParserData,
      isLoading,
      isError,
    } = useFetch(parserService.get);
    getParserData();

    const selectedComponent = ref<VueComponent | null>(null);
    const selectedChannel = ref<Prop | null>(null);

    const route = useRoute();
    const selectedChannelType = computed<string>(
      () => (route && typeof route.name === 'string' ? route.name : 'Props'),
    );

    const nodeSizeFilter = ref<string>('props');
    const componentSearch = ref<string>('');

    const formatDataForForceLayout = (originalData: VueComponent[]) => {
      const nodes: VueComponent[] = [];
      const links: Link[] = [];
      originalData.forEach((component: VueComponent) => {
        nodes.push(component);
        component.dependencies.forEach(
          (dependency: Dependency) => links.push({
            source: component.fullPath,
            target: dependency.fullPath,
          }),
        );
      });
      return { nodes, links };
    };

    const forceGraphData: ComputedRef<ForceLayout | null> = computed(() => {
      if (data && data.value !== null) {
        return formatDataForForceLayout(data.value as unknown as VueComponent[]);
      }
      return null;
    });

    return {
      componentSearch,
      data,
      forceGraphData,
      isLoading,
      isError,
      nodeSizeFilter,
      selectedChannel,
      selectedChannelType,
      selectedComponent,
    };
  },
});
</script>
<style lang="scss">
.pageCommunication {
    &__menu {
        position: fixed;
        top: 0;
        left: 0;
    }
}
</style>