<template>
  <img alt="Vue logo" src="assets/logo.png">
  <hello-world msg="Test" />
  <Test msg="Test" camel-case="asfd"/>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import HelloWorld from './components/HelloWorld.vue';
import Test from './components/Test.vue';

export default defineComponent({
  name: 'App',
  components: {
    HelloWorld,
    Test,
  },
  props: {
    test: {
      type: String,
      default: 'Test',
    },
  },
});
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
