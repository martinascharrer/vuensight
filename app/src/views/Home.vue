<template>
    <div class="home">
        <p v-if="isLoading">... loading</p>
        <p v-else-if="error">Something went wrong parsing your project.</p>
        <div v-else>
            <p>Total amount of components: {{ data.length }}</p>
            <div class="component-list">
                <vue-component
                    v-for="component in data"
                    :key="component.name"
                    :component="component"
                />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { getParsedData } from '@/api';

import VueComponent from '@/components/VueComponent.vue';

import { useFetch } from '@/composables/fetch';

export default defineComponent({
  name: 'Home',
  components: {
    VueComponent,
  },
  setup() {
    const {
      data,
      getData,
      isLoading,
      error,
    } = useFetch(getParsedData);

    getData();

    return {
      data,
      isLoading,
      error,
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
