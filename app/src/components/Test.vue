<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    Test
  </div>
</template>

<script lang="ts">

export default {
  name: 'Test',
  props: {
    msg: {
      type: String,
      default: 'Hallo',
    },
    camelCase: {
      type: String,
      default: 'Hallo',
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
