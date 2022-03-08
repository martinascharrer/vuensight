<template>
  <div class="cardCommunicationChannel">
      <h3>{{ channel.name }}</h3>
      <p>some info about this component</p>
  </div>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'CardCommunicationChannel',
  props: {
    channel: {
      type: Object,
      required: true,
    },
  },
});
</script>

<style lang="scss">
.cardCommunicationChannel {
    background: white;
    padding: var(--spacing--l);
    border-radius: var(--border-radius--m);
    box-shadow: var(--box-shadow--s);
}
</style>
