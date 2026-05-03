<template>
    <q-page class="project-detail-page q-pa-lg">
        <div class="page-hero q-mb-lg">
            <div>
                <div class="text-h5 text-weight-bold section-title">Detalle del Proyecto</div>
                <div class="text-caption section-subtitle">Actividades relacionadas y metricas EVM</div>
            </div>
            <div class="row q-gutter-sm">
                <Button label="Agregar actividad" color="positive" icon="add" :outline="false" text-color="white"
                    @click="openActivityModal" />
                <Button label="Volver" color="primary" icon="arrow_back" :outline="false" text-color="white"
                    @click="goBack" />
            </div>
        </div>

        <q-card v-if="hasActivities" flat bordered class="glass-panel q-mb-md project-header-card">
            <q-card-section>
                <div class="text-subtitle1 text-weight-bold">Proyecto</div>
                <div class="text-body1">{{ project?.nombre || '-' }}</div>
                <div class="text-caption text-grey-7">ID: {{ project?.id || '-' }}</div>
            </q-card-section>
        </q-card>

        <div v-if="hasActivities" class="row q-col-gutter-md q-mb-md">
            <div class="col-12 col-sm-6 col-md-3" v-for="item in evmCards" :key="item.label">
                <q-card flat bordered class="glass-panel metric-card">
                    <q-card-section>
                        <div class="text-caption text-grey-7">{{ item.label }}</div>
                        <div class="text-h6 text-weight-bold">{{ item.value }}</div>
                        <q-chip v-if="item.interpretation" dense :color="getProjectStatusChip(item).color"
                            :text-color="getProjectStatusChip(item).textColor" :label="item.interpretation"
                            class="q-mt-xs" />
                    </q-card-section>
                </q-card>
            </div>
        </div>

        <q-card v-else flat bordered class="glass-panel q-mb-md empty-state-card">
            <q-card-section class="column items-center text-center q-gutter-sm">
                <q-icon name="query_stats" size="48px" color="primary" />
                <div class="text-h6 text-weight-bold">Aun no hay actividades en este proyecto</div>
                <div class="text-body2 section-subtitle">
                    Para mostrar la informacion del proyecto y la grafica PV/EV/AC, primero debes agregar actividades.
                </div>
                <Button
                    label="Agregar primera actividad"
                    color="positive"
                    icon="add"
                    :outline="false"
                    text-color="white"
                    @click="openActivityModal"
                />
            </q-card-section>
        </q-card>

        <q-card v-if="hasActivities" flat bordered class="glass-panel q-mb-md chart-card">
            <q-card-section>
                <div class="text-subtitle1 text-weight-bold q-mb-sm">Comparativo PV vs EV vs AC por actividad</div>
                <div class="chart-container">
                    <Bar v-if="activities.length" :data="chartData" :options="chartOptions" />
                    <div v-else class="text-caption text-grey-7">No hay actividades para graficar.</div>
                </div>
            </q-card-section>
        </q-card>

        <q-card v-if="hasActivities" flat class="glass-panel table-wrapper q-mb-md">
            <q-card-section class="table-heading">
                <div class="text-subtitle1 text-weight-bold section-title">Actividades del Proyecto</div>
                <div class="text-caption section-subtitle">Detalle tecnico y rendimiento EVM por actividad.</div>
            </q-card-section>

            <q-separator class="separator-soft" />

            <q-card-section class="search-section q-pb-none">
                <q-input v-model="searchActivities" outlined dense placeholder="Buscar actividad..." type="text"
                    prefix-icon="search" />
            </q-card-section>

            <q-separator class="separator-soft" />

            <q-card-section>
                <Table :rows="activities" :columns="columns" :pagination="pagination" :loanding-table="loadingTable"
                    hide-bottom>
                    <template #body-cell-id="scope">
                        <q-td :props="scope" class="text-center">
                            <Qchip :label="`#${scope.row.id}`" color="primary" text-color="white" size="sm" />
                        </q-td>
                    </template>

                    <template #body-cell-cpi="scope">
                        <q-td :props="scope" class="text-center">
                            <div>{{ scope.row.evm?.cpi?.value ?? '-' }}</div>
                            <q-chip v-if="scope.row.evm?.cpi?.interpretation" dense
                                :color="getCpiChip(scope.row.evm?.cpi?.value).color"
                                :text-color="getCpiChip(scope.row.evm?.cpi?.value).textColor"
                                :label="scope.row.evm?.cpi?.interpretation" class="q-mt-xs" />
                        </q-td>
                    </template>

                    <template #body-cell-spi="scope">
                        <q-td :props="scope" class="text-center">
                            <div>{{ scope.row.evm?.spi?.value ?? '-' }}</div>
                            <q-chip v-if="scope.row.evm?.spi?.interpretation" dense
                                :color="getSpiChip(scope.row.evm?.spi?.value).color"
                                :text-color="getSpiChip(scope.row.evm?.spi?.value).textColor"
                                :label="scope.row.evm?.spi?.interpretation" class="q-mt-xs" />
                        </q-td>
                    </template>
                </Table>
            </q-card-section>
        </q-card>

        <Modal v-model="modalActivity" :form-ref="true" width="560px" persistent ref="activityModalRef"
            @submit="submitActivity">
            <template #header>
                <div class="text-h6">Nueva actividad</div>
            </template>

            <template #body>
                <div class="row q-col-gutter-md">
                    <div class="col-12">
                        <q-input v-model="formActivity.nombre" label="Nombre" outlined dense
                            :rules="[(val) => !!val || 'El nombre es obligatorio']" />
                    </div>
                    <div class="col-12 col-sm-6">
                        <q-input v-model.number="formActivity.bac" type="number" label="BAC" outlined dense
                            :rules="[(val) => val !== null && val !== '' || 'BAC requerido']" />
                    </div>
                    <div class="col-12 col-sm-6">
                        <q-input v-model.number="formActivity.actual_cost" type="number" label="Costo real (AC)"
                            outlined dense :rules="[(val) => val !== null && val !== '' || 'Costo real requerido']" />
                    </div>
                    <div class="col-12 col-sm-6">
                        <q-input v-model.number="formActivity.planned_percent" type="number" label="% planificado"
                            outlined dense :rules="[(val) => val >= 0 && val <= 100 || 'Debe estar entre 0 y 100']" />
                    </div>
                    <div class="col-12 col-sm-6">
                        <q-input v-model.number="formActivity.actual_percent" type="number" label="% real" outlined
                            dense :rules="[(val) => val >= 0 && val <= 100 || 'Debe estar entre 0 y 100']" />
                    </div>
                </div>
            </template>

            <template #footer>
                <Button label="Cancelar" color="grey-7" text-color="white" :outline="false" :disable="loadingActivity"
                    @click="closeActivityModal" />
                <Button label="Guardar actividad" type="submit" color="positive" text-color="white" :outline="false"
                    :loading="loadingActivity" />
            </template>
        </Modal>
    </q-page>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Bar } from 'vue-chartjs'
import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale
} from 'chart.js'

import Button from '../components/button.vue'
import Modal from '../components/Modal.vue'
import Qchip from '../components/Qchip.vue'
import Table from '../components/Table.vue'
import { useNotifications } from '../composables/useNotifications.js'
import { getData, postData } from '../services/apiclient.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const route = useRoute()
const router = useRouter()
const { error, success, warning } = useNotifications()

const project = ref(null)
const activities = ref([])
const allActivities = ref([])
const evm = ref(null)
const noActivities = ref(false)
const loadingTable = ref(false)
const loadingActivity = ref(false)
const modalActivity = ref(false)
const activityModalRef = ref(null)
const searchActivities = ref('')

let debounceTimeout

const formActivity = ref({
    nombre: '',
    bac: 0,
    planned_percent: 0,
    actual_percent: 0,
    actual_cost: 0
})

const pagination = ref({
    page: 1,
    rowsPerPage: 10,
    rowsNumber: 0
})

const columns = [
    { name: 'id', label: 'ID', field: 'id', align: 'center' },
    { name: 'nombre', label: 'Actividad', field: 'nombre', align: 'center' },
    { name: 'bac', label: 'BAC', field: 'bac', align: 'center' },
    { name: 'planned_percent', label: '% Plan', field: 'planned_percent', align: 'center' },
    { name: 'actual_percent', label: '% Real', field: 'actual_percent', align: 'center' },
    { name: 'actual_cost', label: 'AC', field: 'actual_cost', align: 'center' },
    { name: 'pv', label: 'PV', field: (row) => row.evm?.pv, align: 'center' },
    { name: 'ev', label: 'EV', field: (row) => row.evm?.ev, align: 'center' },
    { name: 'cv', label: 'CV', field: (row) => row.evm?.cv, align: 'center' },
    { name: 'sv', label: 'SV', field: (row) => row.evm?.sv, align: 'center' },
    { name: 'cpi', label: 'CPI', field: (row) => row.evm?.cpi?.value, align: 'center' },
    { name: 'spi', label: 'SPI', field: (row) => row.evm?.spi?.value, align: 'center' }
]

const chartData = computed(() => {
    return {
        labels: allActivities.value.map((activity) => activity.nombre),
        datasets: [
            {
                label: 'PV',
                data: allActivities.value.map((activity) => activity.evm?.pv ?? 0),
                backgroundColor: '#3b82f6'
            },
            {
                label: 'EV',
                data: allActivities.value.map((activity) => activity.evm?.ev ?? 0),
                backgroundColor: '#10b981'
            },
            {
                label: 'AC',
                data: allActivities.value.map((activity) => activity.evm?.ac ?? 0),
                backgroundColor: '#f59e0b'
            }
        ]
    }
})

const hasActivities = computed(() => allActivities.value.length > 0 && !noActivities.value)

const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'top'
        },
        tooltip: {
            footerFont: {
                weight: 'bold'
            },
            callbacks: {
                footer: (tooltipItems) => {
                    if (!tooltipItems?.length) {
                        return ''
                    }

                    const activityIndex = tooltipItems[0].dataIndex
                    const activity = allActivities.value[activityIndex]

                    if (!activity) {
                        return ''
                    }

                    const cpiStatus = activity.evm?.cpi?.interpretation || 'Sin datos'
                    const spiStatus = activity.evm?.spi?.interpretation || 'Sin datos'

                    return [`Estado CPI: ${cpiStatus}`, `Estado SPI: ${spiStatus}`]
                }
            }
        },
        title: {
            display: false
        }
    },
    scales: {
        x: {
            ticks: {
                maxRotation: 30,
                minRotation: 0
            }
        },
        y: {
            beginAtZero: true
        }
    }
}

const evmCards = computed(() => {
    if (!evm.value) {
        return []
    }

    return [
        { label: 'BAC', value: evm.value.bac ?? '-' },
        { label: 'PV', value: evm.value.pv ?? '-' },
        { label: 'EV', value: evm.value.ev ?? '-' },
        { label: 'AC', value: evm.value.ac ?? '-' },
        { label: 'CV', value: evm.value.cv ?? '-' },
        { label: 'SV', value: evm.value.sv ?? '-' },
        {
            label: 'CPI',
            value: evm.value.cpi?.value ?? '-',
            interpretation: evm.value.cpi?.interpretation || ''
        },
        {
            label: 'SPI',
            value: evm.value.spi?.value ?? '-',
            interpretation: evm.value.spi?.interpretation || ''
        },
        { label: 'EAC', value: evm.value.eac ?? '-' },
        { label: 'VAC', value: evm.value.vac ?? '-' }
    ]
})

const getCpiChip = (value) => {
    if (value === null || value === undefined) {
        return { color: 'grey-6', textColor: 'white' }
    }

    if (value < 1) {
        return { color: 'negative', textColor: 'white' }
    }

    if (value > 1) {
        return { color: 'positive', textColor: 'white' }
    }

    return { color: 'warning', textColor: 'black' }
}

const getSpiChip = (value) => {
    if (value === null || value === undefined) {
        return { color: 'grey-6', textColor: 'white' }
    }

    if (value < 1) {
        return { color: 'negative', textColor: 'white' }
    }

    if (value > 1) {
        return { color: 'positive', textColor: 'white' }
    }

    return { color: 'warning', textColor: 'black' }
}

const getProjectStatusChip = (item) => {
    if (item.label === 'CPI') {
        return getCpiChip(item.value)
    }

    if (item.label === 'SPI') {
        return getSpiChip(item.value)
    }

    return { color: 'primary', textColor: 'white' }
}

const getProjectDetail = async () => {
    loadingTable.value = true

    try {
        const res = await getData(`/evm/getProjectEvm/${route.params.id}`)
        noActivities.value = false
        project.value = res.project || null
        allActivities.value = res.activities || []
        activities.value = res.activities || []
        evm.value = res.evm || null
        pagination.value.rowsNumber = allActivities.value.length
    } catch (err) {
        const message = err.response?.data?.msg || err.response?.data?.errors?.[0] || 'Error al obtener detalle de proyecto'

        if (String(message).toLowerCase().includes('no tiene actividades')) {
            noActivities.value = true
            activities.value = []
            allActivities.value = []
            evm.value = null
            pagination.value.rowsNumber = 0
            return
        }

        warning(message)
    } finally {
        loadingTable.value = false
    }
}

watch(searchActivities, (newValue) => {
    // Filtrar actividades solo en la tabla, sin cambiar las métricas del proyecto
    if (newValue.trim() === '') {
        activities.value = allActivities.value
    } else {
        activities.value = allActivities.value.filter((activity) =>
            activity.nombre.toLowerCase().includes(newValue.toLowerCase())
        )
    }
    pagination.value.rowsNumber = activities.value.length
})

const resetActivityForm = () => {
    formActivity.value = {
        nombre: '',
        bac: 0,
        planned_percent: 0,
        actual_percent: 0,
        actual_cost: 0
    }
}

const openActivityModal = () => {
    resetActivityForm()
    modalActivity.value = true
}

const closeActivityModal = () => {
    modalActivity.value = false
}

const submitActivity = async () => {
    const isValid = await activityModalRef.value?.validate()

    if (!isValid) {
        return
    }

    loadingActivity.value = true

    try {
        const res = await postData(`/activities/saveActivity/${route.params.id}`, formActivity.value)
        success(res.msg || 'Actividad creada correctamente')
        closeActivityModal()
        noActivities.value = false
        await getProjectDetail()
        searchActivities.value = '' // Limpiar búsqueda al crear nueva actividad
    } catch (err) {
        error(err.response?.data?.msg || err.response?.data?.errors?.[0]?.msg || 'Error al crear actividad')
    } finally {
        loadingActivity.value = false
    }
}

const goBack = () => {
    router.push('/app/projects')
}

onMounted(() => {
    getProjectDetail()
})
</script>

<style scoped>
.project-detail-page {
    background: linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%);
    min-height: calc(100vh - 120px);
}

.chart-container {
    height: 320px;
}

.empty-state-card {
    border-style: dashed;
    border-width: 2px;
    border-color: rgba(30, 64, 175, 0.25) !important;
}

.page-hero {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 14px 16px;
    border-radius: 16px;
    border: 1px solid rgba(15, 35, 72, 0.08);
    background: linear-gradient(130deg, rgba(255, 255, 255, 0.92) 0%, rgba(224, 236, 255, 0.72) 100%);
}

.project-header-card,
.chart-card,
.metric-card,
.table-wrapper {
    border-color: rgba(15, 35, 72, 0.1) !important;
}

.metric-card {
    height: 100%;
}

.table-heading {
    padding-bottom: 12px;
}

.separator-soft {
    opacity: 0.55;
}

.search-section {
    padding: 12px 16px;
}

@media (max-width: 768px) {
    .page-hero {
        flex-direction: column;
        align-items: flex-start;
    }

    .chart-container {
        height: 260px;
    }
}
</style>
