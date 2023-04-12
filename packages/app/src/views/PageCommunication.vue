<template>
    <layout-split-view>
        <div
            v-if="isLoading"
            class="pageCommunication__loading"
        >
            <base-loading-spinner />
            <p>... analyzing your components</p>
        </div>
        <div
            v-else-if="isError"
            class="pageCommunication__error"
        >
            <h2>Oh no!</h2>
            <p>Something went wrong while parsing your project.</p>
        </div>
        <div
            v-else-if="forceGraphData && forceGraphData.nodes.length === 0"
            class="pageCommunication__empty"
        >
            <h2>No components found.</h2>
            <p>Sorry, we could not find any Vue components. Did you specify the correct folder?</p>
        </div>
        <template
            v-else-if="forceGraphData && forceGraphData.nodes.length > 0"
        >
            <menu-communication
                v-model:node-size-filter="nodeSizeFilter"
                v-model:search="componentSearch"
                class="pageCommunication__menu"
            />
            <force-graph
                :data="forceGraphData"
                :node-size-attribute="nodeSizeFilter"
                :search-string="componentSearch"
            />
        </template>
        <template #aside>
            <sidebar-communication
                v-if="selectedComponent"
                :component="selectedComponent"
            />
            <div v-else class="pageCommunication__noSelection">
                <base-icon
                    icon-color="yellow-50"
                    icon-name="select"
                    size="2xl"
                >
                    <icon-select/>
                </base-icon>
                <p>Select one of the components to get details about its props, events and slots.</p>
            </div>
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

import BaseIcon from '@/components/base/BaseIcon.vue';
import BaseLoadingSpinner from '@/components/base/BaseLoadingSpinner.vue';
import ForceGraph from '@/components/ForceGraph.vue';
import IconSelect from '@/components/icons/IconSelect.vue';
import LayoutSplitView from '@/components/layout/LayoutSplitView.vue';
import MenuCommunication from '@/components/MenuCommunication.vue';
import SidebarCommunication from '@/components/SidebarCommunication.vue';

import { useFetch } from '@/composables/fetch';

import {
  VueComponent, Dependency,
} from '@vuensight/types';
import {
  ForceLayout, Link,
} from '@/types/force';
import useSelection from '@/hooks/useSelection';

export default defineComponent({
  name: 'PageCommunication',
  components: {
    BaseIcon,
    BaseLoadingSpinner,
    ForceGraph,
    IconSelect,
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

    const { selectedChannel, selectedComponent } = useSelection();

    // const route = useRoute();
    // const selectedChannelType = computed<string>(
    //   () => (route && typeof route.name === 'string' ? route.name : 'Props'),
    // );

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

    &__loading,
    &__error,
    &__empty,
    &__noSelection {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        margin-top: calc(var(--spacing--3xl) * -1);
        height: 100%;
        color: var(--grey-50);
    }

    &__noSelection {
        width: 75%;
        margin-left: auto;
        margin-right: auto;
        text-align: center;
        gap: var(--spacing--s);
    }
}
</style>
