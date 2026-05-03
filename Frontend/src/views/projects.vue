<template>
    <q-page class="projects-page q-pa-lg">
        <div class="page-hero q-mb-lg">
            <div>
                <div class="text-h5 text-weight-bold section-title">Proyectos</div>
                <div class="text-caption section-subtitle">Gestion de proyectos EVM</div>
            </div>

            <Button label="Nuevo proyecto" color="primary" icon="add" :outline="false" text-color="white"
                @click="openCreateModal" />
        </div>

        <q-card flat class="glass-panel table-wrapper q-mb-md">
            <q-card-section class="table-heading">
                <div class="text-subtitle1 text-weight-bold section-title">Listado de Proyectos</div>
                <div class="text-caption section-subtitle">Administra nombres, seguimiento y acceso al detalle EVM.</div>
            </q-card-section>

            <q-separator class="separator-soft" />

            <q-card-section>
                <Table :rows="rows" :columns="columns" :pagination="pagination" :loanding-table="loadingTable" hide-bottom>
                    <template #body-cell-id="scope">
                        <q-td :props="scope" class="text-center">
                            <Qchip :label="`#${scope.row.id}`" color="primary" text-color="white" size="sm" />
                        </q-td>
                    </template>

                    <template #options="{ row }">
                        <q-td class="text-center">
                            <div class="row justify-center">
                                <buttonsTable icon="visibility" color="primary" size="20px" tooltip="Ver detalle"
                                    @click="goToDetail(row.id)" />
                                <buttonsTable icon="edit" color="warning" size="20px" tooltip="Editar proyecto"
                                    @click="openEditModal(row)" />
                                <buttonsTable icon="delete" color="negative" size="20px" tooltip="Eliminar proyecto"
                                    @click="confirmDelete(row)" />
                            </div>
                        </q-td>
                    </template>
                </Table>
            </q-card-section>
        </q-card>

        <Modal v-model="modalProject" :form-ref="true" width="520px" persistent ref="projectModalRef"
            @submit="submitProject">
            <template #header>
                <div class="text-h6">{{ formProject.id ? 'Editar proyecto' : 'Nuevo proyecto' }}</div>
            </template>

            <template #body>
                <q-input v-model="formProject.nombre" label="Nombre del proyecto" outlined dense autofocus :rules="[
                    (val) => !!val || 'El nombre es obligatorio',
                    (val) => (val && val.length <= 150) || 'Maximo 150 caracteres'
                ]" />
            </template>

            <template #footer>
                <Button label="Cancelar" color="grey-7" text-color="white" :outline="false" :disable="loadingButton"
                    @click="modalProject = false" />
                <Button :label="formProject.id ? 'Actualizar' : 'Guardar'" type="submit" color="primary"
                    text-color="white" :outline="false" :loading="loadingButton" />
            </template>
        </Modal>

        <Modal v-model="modalDelete" width="440px" persistent>
            <template #header>
                <div class="text-h6">Confirmar eliminacion</div>
            </template>

            <template #body>
                <div class="text-body1">
                    Deseas eliminar el proyecto
                    <span class="text-weight-bold">"{{ projectToDelete?.nombre }}"</span>?
                </div>
            </template>

            <template #footer>
                <Button
                    label="Cancelar"
                    color="grey-7"
                    text-color="white"
                    :outline="false"
                    :disable="loadingDelete"
                    @click="closeDeleteModal"
                />
                <Button
                    label="Eliminar"
                    color="negative"
                    text-color="white"
                    :outline="false"
                    :loading="loadingDelete"
                    @click="handleDelete"
                />
            </template>
        </Modal>
    </q-page>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import Button from '../components/button.vue'
import buttonsTable from '../components/buttonsTable.vue'
import Modal from '../components/Modal.vue'
import Qchip from '../components/Qchip.vue'
import Table from '../components/Table.vue'
import { useNotifications } from '../composables/useNotifications.js'
import { deleteData, getData, postData, putData } from '../services/apiclient.js'

const { error, success } = useNotifications()
const router = useRouter()

const rows = ref([])
const loadingTable = ref(false)
const loadingButton = ref(false)
const loadingDelete = ref(false)
const modalProject = ref(false)
const modalDelete = ref(false)
const projectModalRef = ref(null)
const projectToDelete = ref(null)

const formProject = ref({
    id: null,
    nombre: ''
})

const pagination = ref({
    page: 1,
    rowsPerPage: 10,
    rowsNumber: 0
})

const columns = [
    {
        name: 'id',
        label: 'ID',
        field: 'id',
        align: 'center'
    },
    {
        name: 'nombre',
        label: 'Nombre',
        field: 'nombre',
        align: 'center'
    },
    {
        name: 'created_at',
        label: 'Creado',
        field: 'created_at',
        align: 'center',
        format: (val) => new Date(val).toLocaleString()
    },
    {
        name: 'options',
        label: 'Opciones',
        field: 'options',
        align: 'center'
    }
]

const resetForm = () => {
    formProject.value = {
        id: null,
        nombre: ''
    }
}

const getProjects = async () => {
    loadingTable.value = true

    try {
        const res = await getData(`/projects/getProjects`)
        rows.value = res.projects || []
        pagination.value.rowsNumber = rows.value.length
    } catch (err) {
        error(err.response?.data?.msg || err.response?.data?.errors?.[0]?.msg || 'Error al obtener proyectos')
    } finally {
        loadingTable.value = false
    }
}

const openCreateModal = () => {
    resetForm()
    modalProject.value = true
}

const openEditModal = (project) => {
    formProject.value = {
        id: project.id,
        nombre: project.nombre
    }
    modalProject.value = true
}

const goToDetail = (projectId) => {
    router.push(`/app/projects/${projectId}`)
}

const submitProject = async () => {
    const isValid = await projectModalRef.value?.validate()

    if (!isValid) {
        return
    }

    loadingButton.value = true

    try {
        if (formProject.value.id) {
            const res = await putData(
                `/projects/updateProject/${formProject.value.id}`,
                { nombre: formProject.value.nombre }
            )
            success(res.msg || 'Proyecto actualizado correctamente')
        } else {
            const res = await postData(`/projects/saveProject`, {
                nombre: formProject.value.nombre
            })
            success(res.msg || 'Proyecto creado correctamente')
        }

        modalProject.value = false
        resetForm()
        await getProjects()
    } catch (err) {
        error(err.response?.data?.msg || err.response?.data?.errors?.[0]?.msg || 'Error al guardar el proyecto')
    } finally {
        loadingButton.value = false
    }
}

const confirmDelete = (project) => {
    projectToDelete.value = project
    modalDelete.value = true
}

const closeDeleteModal = () => {
    modalDelete.value = false
    projectToDelete.value = null
}

const handleDelete = async () => {
    if (!projectToDelete.value?.id) {
        return
    }

    loadingDelete.value = true

    try {
        await deleteProject(projectToDelete.value.id)
        closeDeleteModal()
    } finally {
        loadingDelete.value = false
    }
}

const deleteProject = async (projectId) => {
    loadingTable.value = true

    try {
        const res = await deleteData(`projects/deleteProject/${projectId}`)
        success(res.msg || 'Proyecto eliminado correctamente')
        await getProjects()
    } catch (err) {
        error(err.response?.data?.msg || err.response?.data?.errors?.[0]?.msg || 'Error al eliminar el proyecto')
    } finally {
        loadingTable.value = false
    }
}

onMounted(() => {
    getProjects()
})
</script>

<style scoped>
.projects-page {
    background: linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%);
    min-height: calc(100vh - 120px);
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

.table-wrapper {
    overflow: hidden;
}

.table-heading {
    padding-bottom: 12px;
}

.separator-soft {
    opacity: 0.55;
}

@media (max-width: 768px) {
    .page-hero {
        flex-direction: column;
        align-items: flex-start;
    }
}
</style>
