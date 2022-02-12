<template>
    <div>
        <slot name="header" />
        Test {{ title }}
        <button @click="$emit('selected')">Select</button>
    </div>
</template>

<script>
export default {
    name: 'Child',
    props: {
        title: {
            default: 'Hello',
            type: String
        }
    }
};
</script>

<style scoped>

</style>