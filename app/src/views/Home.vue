<template>
    <div class="home">
        <p v-if="isLoading">... loading</p>
        <p v-else-if="isError">Something went wrong parsing your project.</p>
        <div v-else>
            <force-graph v-if="forceGraphData" :data="forceGraphData"/>
            <p>Total amount of components: {{ data.length }}</p>
            <div class="component-list">
                <vue-component-card
                    v-for="component in data"
                    :key="component.name"
                    :component="component"
                />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ComputedRef,
  computed,
  watchEffect,
} from 'vue';
import * as parserService from '@/services/parser';

import ForceGraph from '@/components/ForceGraph.vue';
import VueComponentCard from '@/components/VueComponentCard.vue';

import { useFetch } from '@/composables/fetch';

import {
  ForceLayout, VueComponent, Dependency, Link, Node,
} from '@/types/index.d';

export default defineComponent({
  name: 'Home',
  components: {
    ForceGraph,
    VueComponentCard,
  },
  setup() {
    const {
      data,
      get: getParserData,
      isLoading,
      isError,
    } = useFetch(parserService.get);

    getParserData();

    const forceGraphData: ComputedRef<ForceLayout | null> = computed(() => {
      if (data && data.value !== null && data) {
        const copy = data.value as unknown as VueComponent[];
        const temp: ForceLayout = { nodes: [] as Node[], links: [] as Link[] };
        copy.forEach((component: VueComponent) => {
          if (!component.fullPath.includes('.js')) {
            temp.nodes.push({ id: component.fullPath, title: component.name, size: 30 });
            component.dependencies.forEach((dependency: Dependency, index) => {
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
    watchEffect(() => console.log(forceGraphData.value));

    return {
      data,
      isLoading,
      isError,
      forceGraphData,
    };
  },
});
</script>
<style scoped lang="scss">
.component-list {
    margin: auto;
    display: flex;
    flex-wrap: wrap;
    max-width: 80vw;
    justify-content: space-between;
    gap: 2vw;
}
</style>
