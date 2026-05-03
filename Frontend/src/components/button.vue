<template>
    <q-btn :label="label" :type="type" :unelevated="unelevated" :class="['app-btn', customClass]" :loading="loading"
        :icon="icon" :color="color" :padding="padding" :flat="flat" :round="round" :dense="dense" :glossy="glossy"
        :no-caps="noCaps" :text-color="textColor" :size="size" :disable="disabled" :outline="outline"
        :rounded="rounded" @click="handleClick">

        <template v-slot:loading>
            <q-spinner-ios color="white" size="1em" />
        </template>
        <slot />

        <q-tooltip anchor="bottom middle" v-if="activeTooltip">{{ tooltip }}</q-tooltip>
    </q-btn>
</template>

<script setup>
const props = defineProps({
    label: String,
    type: String,
    loading: Boolean,
    icon: String,
    color: {
        type: String
    },
    padding: {
        type: String,
        default: '10px'
    },
    flat: Boolean,
    glossy: Boolean,
    noCaps: Boolean,
    round: Boolean,
    rounded: {
        type: Boolean,
        default: true
    },
    dense: Boolean,
    textColor: String,
    customClass: String,
    size: String,
    disabled: Boolean,
    tooltip: String,
    activeTooltip: Boolean,
    outline: {
        type: Boolean,
        default: true
    },
    unelevated: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits(['click']);

// Solo emite click si NO es type="submit"
const handleClick = (event) => {
    if (props.type !== 'submit') {
        emit('click', event)
    }
}
</script>

<style scoped>
.app-btn {
    font-weight: 700;
    letter-spacing: 0.2px;
    transition: transform 0.2s ease, box-shadow 0.2s ease, filter 0.2s ease;
}

.app-btn:hover {
    cursor: pointer;
    transform: translateY(-1px);
    box-shadow: 0 10px 20px rgba(15, 35, 72, 0.18);
    filter: saturate(1.05);
}

.app-btn:active {
    transform: translateY(0);
}
</style>