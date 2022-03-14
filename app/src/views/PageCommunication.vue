<template>
    <layout-split-view>
        <p v-if="isLoading">... loading</p>
        <p v-else-if="isError">Something went wrong parsing your project.</p>
        <force-graph
            v-else-if="forceGraphData"
            :selected-component="selectedComponent"
            :selected-channel="selectedChannel"
            :selected-channel-type="selectedChannelType"
            :data="forceGraphData"
            @selected="selectComponent"
            @unselected="selectedComponent = null"
        />
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
import SidebarCommunication from '@/components/SidebarCommunication.vue';

import { useFetch } from '@/composables/fetch';

import {
  ForceLayout, VueComponent, Dependency, Link, Prop,
} from '@/types/index.d';

export default defineComponent({
  name: 'PageCommunication',
  components: {
    ForceGraph,
    LayoutSplitView,
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
    const selectComponent = (fullPath: string) => {
      const copy = data.value as unknown as VueComponent[];
      selectedComponent.value = copy.find((component) => component.fullPath === fullPath) ?? null;
    };

    const selectedChannel = ref<Prop | null>(null);

    const route = useRoute();
    const selectedChannelType = computed<string>(
      () => (route && typeof route.name === 'string' ? route.name : 'Props'),
    );

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
      data,
      selectedChannel,
      selectedChannelType,
      selectComponent,
      selectedComponent,
      isLoading,
      isError,
      forceGraphData,
    };
  },
});
</script>
