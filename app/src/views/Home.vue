<template>
  <div class="home">
     <ul>
         <li v-for="item in data" :key="item.name">
             {{ item.name }}: {{ item.props.map(i => i.name).join() }}
         </li>
     </ul>
  </div>
</template>

<script lang="ts">
import { ref, defineComponent, watchEffect } from 'vue';
import { getParsedData } from '@/api';

export default defineComponent({
  name: 'Home',
  setup() {
    console.log('setup hook');
    const data = ref(null);
    getParsedData().then((result) => { data.value = result; });

    watchEffect(() => console.log('data', data.value));

    return {
      data,
    };
  },
});
</script>
