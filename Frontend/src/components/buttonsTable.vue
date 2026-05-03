<template>
    <q-icon :name="icon" :color="props.color" :size="props.size" class="iconButton cursor-pointer"
        @click="$emit('click')">
        <q-tooltip anchor="bottom middle" class="action-tooltip">
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
    padding: 8px;
    border-radius: 999px;
    transition: all 0.2s ease;
}

.iconButton:hover {
    transform: translateY(-1px) scale(1.05);
    background: rgba(15, 35, 72, 0.12);
    box-shadow: 0 6px 14px rgba(15, 35, 72, 0.14);
}

.action-tooltip {
    font-size: 12px;
    font-weight: 600;
}
</style>