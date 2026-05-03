<template>
    <q-btn :label="label" :type="type" :unelevated="unelevated" :class="[customClass]" :loading="loading" :icon="icon"
        :color="color" :padding="padding" :flat="flat" :round="round" :dense="dense" :glossy="glossy" :no-caps="noCaps"
        :text-color="textColor" text-color="black" :size="size" :disable="disabled" :outline="outline"
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
/* Hover global para botones */
button:hover {
    cursor: pointer;
}
</style>