<template>
  <div class="sidebarCommunication">
      <h2>{{ selectedComponent?.name }}</h2>
      <p>{{ selectedComponent?.fullPath }}</p>
      <base-sub-nav
          :items="[
              {
                  to: '/',
                  name: 'Props',
                  color: 'mint',
                  counter: selectedComponent?.props.length,
                  disabled: selectedComponent?.props.length > 0
              },
              {
                  to: '/events',
                  name: 'Events',
                  color: 'red',
                  counter: selectedComponent?.events.length,
                  disabled: selectedComponent?.events.length > 0
              },
              {
                  to: '/slots',
                  name: 'Slots',
                  color: 'purple',
                  counter: selectedComponent?.slots.length,
                  disabled: selectedComponent?.slots.length > 0
              }
          ]"
      />
      <router-view />
  </div>
</template>

<script setup lang="ts">
import BaseSubNav from '@/components/base/BaseSubNav.vue';
import useSelection from '@/hooks/useSelection';

const { selectedComponent } = useSelection();
</script>

<style lang="scss">
.sidebarCommunication {
    display: flex;
    flex-direction: column;
    gap: var(--spacing--l);
    height: 100%;
}
</style>
