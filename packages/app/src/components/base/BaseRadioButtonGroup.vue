<template>
    <form class="baseRadioButtonGroup">
        <label
            v-for="option in options"
            :key="option.value"
            :for="option.value"
            class="baseRadioButtonGroup__label"
        >
            <input
                type="radio"
                :name="name"
                :checked="modelValue === option.value"
                :value="option.value"
                :id="option.value"
                class="baseRadioButtonGroup__input"
                @change="$emit('update:modelValue', option.value)"
            />
            {{ option.label }}
        </label>
    </form>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

type RadioButtonItem = {
    label: string;
    value: string;
}

export default defineComponent({
  props: {
    modelValue: {
      type: String,
      default: 'props',
    },
    name: {
      type: String,
      default: 'radio-button',
    },
    options: {
      type: Array as PropType<RadioButtonItem[]>,
      required: true,
    },
  },
});
</script>
<style lang="scss">
.baseRadioButtonGroup {
    display: flex;
    flex-direction: column;
    align-items: start;
    gap: var(--spacing--m);
    cursor: pointer;

    &__input {
        accent-color: var(--mint-70);
    }

    &__label {
        width: 100%;
        cursor: pointer;
    }
}
</style>
