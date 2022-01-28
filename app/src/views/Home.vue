<template>
    <div class="home">
        <p v-if="isLoading">... loading</p>
        <p v-else-if="isError">Something went wrong parsing your project.</p>
        <div v-else>
        <div ref="graph"></div>
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
} from 'vue';
import * as parserService from '@/services/parser';

import VueComponentCard from '@/components/VueComponentCard.vue';

import { useFetch } from '@/composables/fetch';

export default defineComponent({
  name: 'Home',
  components: {
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

    return {
      data,
      isLoading,
      isError,
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
