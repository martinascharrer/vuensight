<template>
  <router-view/>
</template>

<style lang="scss">
@import 'assets/css/color.css';
@import 'assets/css/font.css';
@import 'assets/css/spacing.css';
@import 'assets/css/border-radius.css';
@import 'assets/css/box-shadow.css';

body {
    margin: 0;
    padding: 0;
}

#app {
  font-family: NotoSans, Arial, Helvetica, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: var(--navy-90);
}

h1, h2, h3, h4, p {
    margin: 0;
}

h2, h3, h4 {
    font-weight: normal;
}
</style>
