<template>
    <q-dialog v-model="modelValue" :persistent="propsModal.persistent">
        <q-card class="modern-modal-card" :style="{ width: propsModal.width, maxWidth: propsModal.maxWidth }">

            <!-- HEADER -->
            <q-card-section class="modal-header">
                <slot name="header"></slot>
            </q-card-section>

            <q-form v-if="formRef" ref="internalFormRef" @submit="emit('submit')">
                <q-card-section class="modal-body">
                    <slot name="body"></slot>
                </q-card-section>

                <q-separator class="q-my-none" />

                <q-card-section class="modal-footer">
                    <slot name="footer"></slot>
                </q-card-section>
            </q-form>

            <template v-else>
                <q-card-section class="modal-body">
                    <slot name="body"></slot>
                </q-card-section>

                <q-separator class="q-my-none" />

                <q-card-section class="modal-footer">
                    <slot name="footer"></slot>
                </q-card-section>
            </template>
        </q-card>
    </q-dialog>
</template>

<script setup>

import { ref } from 'vue'


const propsModal = defineProps({
    persistent: { type: Boolean, default: false },
    width: { type: String, },
    maxWidth: { type: String, default: '90vw' },
    formRef: { type: Boolean, default: false }

})

const emit = defineEmits(['submit'])
const internalFormRef = ref(null)

defineExpose({
    submit: () => {
        if (internalFormRef.value) {
            internalFormRef.value.submit()
        }
    },
    validate: () => {
        if (internalFormRef.value) {
            return internalFormRef.value.validate()
        }
        return Promise.resolve(true)
    }
})


const modelValue = defineModel({ type: Boolean, default: false })

</script>

<style scoped lang="scss">
@import '../quasar-variables.sass';

.modern-modal-card {
    border-radius: 16px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    overflow: hidden;
    animation: slideIn 0.3s ease-out;
}

.modal-header {
    background: linear-gradient(135deg, $primary 0%, $accent 100%);
    color: white;
    padding: 24px !important;
    border-bottom: none;
    font-weight: 600;
    letter-spacing: 0.5px;
    position: relative;
}

.modal-body {
    padding: 28px !important;
    min-height: 200px;
    max-height: 60vh;
    overflow-y: auto;
    background: #fafafa;
}

.modal-footer {
    padding: 16px 28px !important;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(250, 250, 250, 0.8) 100%);
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    border-top: 1px solid rgba(0, 0, 0, 0.05);
    backdrop-filter: blur(10px);
}

</style>