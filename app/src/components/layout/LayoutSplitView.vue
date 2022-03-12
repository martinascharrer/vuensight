<template>
    <div class="layoutSplitView">
        <main class="layoutSplitView__main">
            <slot />
        </main>
        <aside class="layoutSplitView__aside">
            <slot name="aside" />
        </aside>
    </div>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'LayoutSplitView',
});
</script>

<style lang="scss">
.layoutSplitView {
    display: flex;
    flex-direction: row;
    height: 100vh;

    &__main {
        width: 75vw;
    }

    &__aside {
        width: 25vw;
        background: white;
        padding: var(--spacing--l) var(--spacing--xl);
        box-shadow: var(--box-shadow--s);
    }
}
</style>
