<template>

    <q-markup-table v-if="loandingTable">
        <thead>
            <tr>
                <th class="text-left" style="width: 150px">
                    <q-skeleton animation="blink" type="text" />
                </th>
                <th class="text-right">
                    <q-skeleton animation="blink" type="text" />
                </th>
                <th class="text-right">
                    <q-skeleton animation="blink" type="text" />
                </th>
                <th class="text-right">
                    <q-skeleton animation="blink" type="text" />
                </th>
                <th class="text-right">
                    <q-skeleton animation="blink" type="text" />
                </th>
                <th class="text-right">
                    <q-skeleton animation="blink" type="text" />
                </th>
            </tr>
        </thead>

        <tbody>
            <tr v-for="n in 4" :key="n">
                <td class="text-left">
                    <q-skeleton animation="blink" type="text" width="85px" />
                </td>
                <td class="text-right">
                    <q-skeleton animation="blink" type="text" width="50px" />
                </td>
                <td class="text-right">
                    <q-skeleton animation="blink" type="text" width="35px" />
                </td>
                <td class="text-right">
                    <q-skeleton animation="blink" type="text" width="65px" />
                </td>
                <td class="text-right">
                    <q-skeleton animation="blink" type="text" width="25px" />
                </td>
                <td class="text-right">
                    <q-skeleton animation="blink" type="text" width="85px" />
                </td>
            </tr>
        </tbody>
    </q-markup-table>

    <q-table v-else :rows="rows" :columns="columns" flat bordered v-model:pagination="pagination"
        :rows-per-page-options="[10, 20, 30]" @request="$emit('request', $event)"
        rows-per-page-label="Registros Por Pagina" :hide-bottom="hideBottom"
        :table-row-style-fn="defaultRowStyleFn" class="table">

        <template #header="props">
            <q-th v-for="col in props.cols" :key="col.name" :props="props" class="table-header-cell">
                {{ col.label }}
            </q-th>
        </template>

        <template #body-cell-options="props">
            <slot name="options" :row="props.row">
            </slot>
        </template>

        <!-- ESTADO -->
        <template #body-cell-status="props">
            <slot name="status" :row="props.row">
            </slot>
        </template>

        <!-- SIN DATOS -->
        <template #no-data>
            <slot name="no-data">
                <div class="q-pa-md flex flex-center column text-grey full-width">
                    <div class="text-subtitle2 q-mt-sm">No hay datos registrados</div>
                </div>
            </slot>
        </template>


        <!-- Permitir slots personalizados desde el componente padre -->
        <template v-for="(_, slot) in $slots" v-slot:[slot]="scope">
            <slot :name="slot" v-bind="scope" />
        </template>


    </q-table>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    title: { type: String, default: "" },
    rows: { type: Array, default: () => [] },
    columns: { type: Array, default: () => [] },
    pagination: {
        type: Object,
        default: () => ({
            page: 1,
            rowsPerPage: 10,
            rowsNumber: 0
        })
    },
    hideBottom: { type: Boolean, default: false },
    loandingTable: { type: Boolean, default: false }
});

const emit = defineEmits(['update:pagination', 'request'])

// v-model computado para la paginación
const pagination = computed({
    get: () => props.pagination,
    set: (val) => emit('update:pagination', val)
})

const defaultRowStyleFn = (row) => {
    if (row?.status === 1) {
        return { backgroundColor: '#dedede' }
    }
}


</script>


<style scoped lang="scss">
.table-header-cell {
    background-color: $colorHeaderTable;
    color: rgb(255, 255, 255) !important;
    font-weight: 600 !important;
    font-size: 0.95rem !important;
    padding: 16px 12px !important;
    text-align: center !important;
}

.table:deep(.q-table__linear-progress) {
    background-color: #60A5FA !important;
    height: 5px !important;
}


thead{
    background-color: $colorHeaderTable;
}
</style>