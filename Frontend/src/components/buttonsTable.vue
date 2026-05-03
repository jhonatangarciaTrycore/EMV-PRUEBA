<template>
    <q-icon :name="icon" :color="props.color" :size="props.size" class="iconButton cursor-pointer"
        @click="$emit('click')">
        <q-tooltip anchor="bottom middle">
            {{ props.tooltip }}
        </q-tooltip>
    </q-icon>
</template>

<script setup>
const props = defineProps({
    icon: String,
    color: String,
    size: String,
    tooltip: String,
})


defineEmits(['click'])

</script>

<style scoped>
.iconButton {
    margin: 3px;
    transition: all 0.2s ease;
}

.iconButton:hover {
    transform: scale(1.1);
}
</style>