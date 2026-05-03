<template>
    <q-chip :color="props.color" :text-color="props.textColor" :label="props.label" :size="props.size"
        :class="props.class"  />
</template>

<script setup>
const props = defineProps({
    color: {
        type: String,
        default: 'grey'
    },
    textColor: {
        type: String,
        default: 'white'
    },
    label: {
        type: String,
        required: true
    },
    size: {
        type: String,
        default: 'md'
    },
    class: {
        type: String,
        default: ''
    }
})

</script>
