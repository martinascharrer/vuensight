<template>
    <layout-split-view>
        <p v-if="isLoading">... loading</p>
        <p v-else-if="isError">Something went wrong parsing your project.</p>
        <force-graph v-else-if="forceGraphData" :data="forceGraphData" @selected="selectComponent"/>
        <template #aside>
            <sidebar-communication v-if="selectedComponent" :component="selectedComponent" />
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
import * as parserService from '@/services/parser';

import ForceGraph from '@/components/ForceGraph.vue';
import LayoutSplitView from '@/components/layout/LayoutSplitView.vue';
import SidebarCommunication from '@/components/SidebarCommunication.vue';

import { useFetch } from '@/composables/fetch';

import {
  ForceLayout, VueComponent, Dependency, Link, Node,
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

    const selectedComponent = ref<VueComponent | null>(null);

    const selectComponent = (fullPath: string) => {
      const copy = data.value as unknown as VueComponent[];
      selectedComponent.value = copy.find((component) => component.fullPath === fullPath) ?? null;
    };
    getParserData();

    const forceGraphData: ComputedRef<ForceLayout | null> = computed(() => {
      if (data && data.value !== null && data) {
        const copy = data.value as unknown as VueComponent[];
        const temp: ForceLayout = { nodes: [] as Node[], links: [] as Link[] };
        copy.forEach((component: VueComponent) => {
          if (!component.fullPath.includes('.js')) {
            temp.nodes.push({ id: component.fullPath, title: component.name, size: 30 });
            component.dependencies.forEach((dependency: Dependency) => {
              if (!dependency.fullPath.includes('.js')) {
                temp.links.push({ source: component.fullPath, target: dependency.fullPath });
              }
            });
          }
        });
        return temp;
      }
      return null;
    });

    return {
      data,
      selectComponent,
      selectedComponent,
      isLoading,
      isError,
      forceGraphData,
    };
  },
});
</script>
