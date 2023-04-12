<template>
    <div
      ref="tooltip"
      class="tooltip"
      :style="`left: ${tooltipPosition.left}px; top: ${tooltipPosition.top}px`"
    >
      <slot />
    </div>
</template>

<script setup lang="ts">
import { defineProps, onMounted, ref } from 'vue';

const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false,
  },
  positionX: {
    type: Number,
    required: true,
  },
  positionY: {
    type: Number,
    required: true,
  },
  offsetTop: {
    type: Number,
    default: 50,
  },
});

const tooltip = ref();
const tooltipPosition = ref({
  left: 0,
  top: 0,
});

onMounted(() => {
  tooltipPosition.value.left = props.positionX - (tooltip.value.getBoundingClientRect().width / 2);
  tooltipPosition.value.top = props.positionY - props.offsetTop;
});
</script>

<style>
.tooltip {
  position: absolute;
  z-index: 1000;
  background: var(--navy-90);
  color: white;
  padding: var(--spacing--2xs) var(--spacing--l);
  border-radius: var(--border-radius--m);
  box-shadow: var(--box-shadow--m);
}
</style>
