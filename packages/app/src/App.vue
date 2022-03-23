<template>
  <router-view/>
</template>

<style lang="scss">
@import 'assets/css/color.css';
@import 'assets/css/font.css';
@import 'assets/css/spacing.css';
@import 'assets/css/border-radius.css';
@import 'assets/css/box-shadow.css';

*, *::before, *::after {
    box-sizing: border-box;
}

* {
    margin: 0;
}

html, body {
    height: 100%;
}

input, button, textarea, select {
    font: inherit;
}

p, h1, h2, h3, h4, h5, h6 {
    overflow-wrap: break-word;
}

#root, #__next {
    isolation: isolate;
}

body {
    font-size: var(--font-size--m);
    font-family: NotoSans, Arial, Helvetica, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: var(--navy-90);
    line-height: 1.5;
}

button {
    border: none;
    background: transparent;
    text-align: inherit;
    padding: 0;
}
</style>
