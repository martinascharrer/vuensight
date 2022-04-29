<template>
  <router-view/>
</template>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans:ital,wght@0,400;0,700;1,400&display=swap');

@import 'assets/css/border-radius.css';
@import 'assets/css/box-shadow.css';
@import 'assets/css/color.css';
@import 'assets/css/font.css';
@import 'assets/css/icon.css';
@import 'assets/css/spacing.css';

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
    border: none;
    background: transparent;
    text-align: inherit;
    padding: 0;

    &:hover {
        border: none;
        outline: none;
    }
}

button {
    cursor: pointer;
}

.input {
    display: flex;
    align-items: center;
    gap: var(--spacing--s);
    background: white;
    border: none;
    border-radius: var(--border-radius--s);
    box-shadow: var(--box-shadow--s);
    padding: var(--spacing--xs) var(--spacing--m);
    min-width: var(--spacing--2xl);
    height: var(--spacing--3xl);

    &:hover {
        outline: 2px solid var(--yellow-30);
    }
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
</style>
