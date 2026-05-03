<template>
    <q-layout view="hHh LpR fFf" class="app-layout">

        <q-header elevated class="modern-header">
            <q-toolbar class="q-py-md q-px-lg">
                <q-btn dense flat round :icon="leftDrawerOpen ? 'close' : 'menu'"
                    @click="leftDrawerOpen = !leftDrawerOpen">
                    <q-tooltip class="bg-grey-9" anchor="bottom middle">{{ leftDrawerOpen ? 'Cerrar' : 'Menú'
                    }}</q-tooltip>
                </q-btn>
                <q-toolbar-title>
                    <div class="row items-center q-gutter-sm brand-wrap">
                        <q-avatar size="36px" class="brand-avatar">
                            <q-icon name="insights" size="22px" />
                        </q-avatar>
                        <div class="column">
                            <span class="text-h5 text-weight-bold">EVM Control Center</span>
                            <span class="text-caption text-grey-3">Monitoreo de costo, avance y rendimiento</span>
                        </div>
                    </div>
                </q-toolbar-title>

                <q-space />
            </q-toolbar>
        </q-header>


        <q-drawer v-model="leftDrawerOpen" :width="262" side="left" class="flex column full-height modern-drawer">

            <div class="sidebar-div">
                <div class="sidebar-header">
                    <!-- Sección de perfil superior -->
                    <div class="user-section">
                        <div class="user-avatar">
                            <q-avatar size="64px" class="q-mb-sm profile-avatar" color="primary">
                                <q-img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" />
                            </q-avatar>
                        </div>
                        <div class="user-name">Oficina PMO</div>
                        <div class="user-subtitle">Analisis EVM</div>
                    </div>

                    <q-separator color="grey-7" class="q-my-md" />

                    <q-list class="q-py-md">
                        <q-item v-for="item in itemsMenu" :key="item.to" clickable v-ripple :to="item.to"
                            class="menu-item" active-class="active-menu-item">
                            <q-icon :name="item.icon" size="22px" class="menu-icon" />
                            <span class="menu-label">{{ item.name }}</span>
                        </q-item>
                    </q-list>
                </div>

                <div class="sidebar-footer">
                    <q-separator color="grey-7" class="q-mb-md" />
                    <q-item clickable class="menu-item logout-item" @click="logout">
                        <q-icon name="logout" size="22px" class="menu-icon" />
                        <span class="menu-label">Cerrar Sesión</span>
                    </q-item>
                </div>
            </div>
        </q-drawer>

        <q-page-container class="page-container">
            <router-view />
        </q-page-container>

        <q-footer class="modern-footer">
            <q-toolbar class="q-py-md q-px-lg">
                <div class="row items-center justify-center full-width">
                    <div class="row items-center q-gutter-sm">
                        <q-icon name="copyright" size="18px" />
                        <span class="text-body2">© {{ fecha }} TryCore · Centro de Control EVM. Todos los derechos reservados</span>
                    </div>
                </div>
            </q-toolbar>
        </q-footer>

    </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

let fecha = new Date().getFullYear()

const leftDrawerOpen = ref(false)

const logout = async () => {
    router.push('/')
}

const itemsMenu = [
    { name: 'Proyectos EVM', icon: 'folder', to: '/app/projects' },
]
</script>

<style scoped>
/* header */
.modern-header {
    background: linear-gradient(125deg, #102a54 0%, #0a1731 55%, #0f2348 100%);
    box-shadow: 0 8px 24px rgba(6, 22, 33, 0.36);
    border-bottom: 1px solid rgba(255, 255, 255, 0.12);
}

.app-layout {
    background: transparent;
}

.brand-wrap {
    align-items: center;
}

.brand-avatar {
    color: #ffffff;
    background: linear-gradient(145deg, #14b8a6 0%, #0ea5e9 100%);
    box-shadow: 0 8px 18px rgba(14, 165, 233, 0.35);
}

.modern-drawer {
    background: linear-gradient(180deg, #1c2740 0%, #0f172c 100%) !important;
    padding: 0;
    border-right: 1px solid rgba(255, 255, 255, 0.08);
}

.user-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px 16px;
}

.user-name {
    font-size: 16px;
    font-weight: 700;
    color: #e8e9ec;
    text-align: center;
    margin: 4px 0;
    letter-spacing: 0.5px;
}

.user-subtitle {
    font-size: 11px;
    color: #8b92a0;
    text-align: center;
    text-transform: uppercase;
    letter-spacing: 0.3px;
}

.sidebar-div {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
    padding: 12px;
}

.sidebar-header {
    flex: 1;
}

.sidebar-footer {
    display: flex;
    flex-direction: column;
    padding-bottom: 12px;
}

.menu-item {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 12px;
    border-radius: 10px;
    background: transparent;
    color: #bdc3c7;
    margin: 4px 8px;
    padding: 12px 16px;
    border: 1px solid transparent;
    transition: all 0.25s ease;
}

.menu-icon {
    flex-shrink: 0;
    color: #95a5a6;
    transition: color 0.3s ease;
}

.menu-label {
    font-size: 14px;
    font-weight: 500;
    color: inherit;
    transition: color 0.3s ease;
}

.menu-item:hover {
    background-color: rgba(255, 255, 255, 0.12);
    border-color: rgba(255, 255, 255, 0.14);
    color: #ecf0f1;
    transform: translateX(2px);
}

.active-menu-item {
    background: linear-gradient(135deg, #1e40af 0%, #14b8a6 100%);
    color: #ffffff;
    border-color: rgba(255, 255, 255, 0.18);
    box-shadow: 0 8px 18px rgba(20, 184, 166, 0.28);
}

.active-menu-item .menu-icon {
    color: #ffffff;
}

.logout-item {
    color: #e74c3c;
}

.logout-item:hover {
    background-color: rgba(231, 76, 60, 0.1);
    color: #ec7063;
}

.logout-item .menu-icon {
    color: #e74c3c;
}

.modern-footer {
    background: linear-gradient(125deg, #0f2348 0%, #07101f 100%);
    color: #ffffff;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
}

@media (max-width: 768px) {
    .user-section {
        padding: 16px 12px;
    }

    .menu-item {
        margin: 4px 4px;
        padding: 10px 12px;
    }
}
</style>