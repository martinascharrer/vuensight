<template>
    <div>
        <Child title="test" @selected="select">
            <template #header>Important Information</template>
        </Child>
    </div>
</template>

<script>
import Child from './Child';
export default {
    name: 'Parent',
    components: { Child },
    methods: {
        select: () => {},
    }
};
</script>

<style scoped>

</style>