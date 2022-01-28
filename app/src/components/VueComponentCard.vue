<template>
  <div class="component">
      <h3>{{ component.fileName }}</h3>
      <p v-if="component.props && component.props.length > 0">
          <em>props:</em> {{ component.props.map(prop => prop.name).join(', ') }}
      </p>
      <p v-if="component.events && component.events.length > 0">
          <em>events:</em> {{ component.events.map(event => event.name).join(', ') }}
      </p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'VueComponentCard',
  props: {
    component: {
      type: Object,
      required: true,
    },
  },
});
</script>

<style scoped lang="scss">
.component {
    display: flex;
    flex-direction: column;
    justify-content: center;
    background: #c8e8e0;
    border-radius: 20px;
    width: 16vw;
    padding: 2rem;
    flex: 1 15vw;
}
</style>
