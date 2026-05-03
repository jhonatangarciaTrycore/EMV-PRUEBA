<template>
    <q-layout view="hHh LpR fFf">

        <q-header elevated class="modern-header">
            <q-toolbar class="q-py-md q-px-lg">
                <q-btn dense flat round :icon="leftDrawerOpen ? 'close' : 'menu'"
                    @click="leftDrawerOpen = !leftDrawerOpen">
                    <q-tooltip class="bg-grey-9" anchor="bottom middle">{{ leftDrawerOpen ? 'Cerrar' : 'Menú'
                    }}</q-tooltip>
                </q-btn>
                <q-toolbar-title>
                    <div class="row items-center q-gutter-md">
                        <div class="column">
                            <span class="text-h5 text-weight-bold">Smart Inventory Core</span>
                            <span class="text-caption text-grey-3">Panel Administrativo</span>
                        </div>
                    </div>
                </q-toolbar-title>

                <q-space />
            </q-toolbar>
        </q-header>


        <q-drawer v-model="leftDrawerOpen" :width="250"
            style="background: linear-gradient(180deg, #1f172a 0%, #16111f 100%) !important; padding: 0;"
            side="left" class="flex column full-height">

            <div class="sidebar-div">
                <div class="sidebar-header">
                    <!-- Sección de perfil superior -->
                    <div class="user-section">
                        <div class="user-avatar">
                            <q-avatar size="60px" class="q-mb-sm" color="primary">
                                <q-img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" />
                            </q-avatar>
                        </div>
                        <div class="user-name">Smart Inventory</div>
                        <div class="user-subtitle">Sistema de Gestión</div>
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
                        <span class="text-body2">© {{ fecha }} TryCore - Smart Inventory Core. Todos los derechos reservados</span>
                    </div>
                </div>
            </q-toolbar>
        </q-footer>

    </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import { useNotifications } from '../composables/useNotifications.js'
import { useRouter, useRoute } from 'vue-router'

const { success } = useNotifications()
const router = useRouter()
const route = useRoute()

let fecha = new Date().getFullYear()

const leftDrawerOpen = ref(false)

const logout = async () => {
    router.push('/')
}

const itemsMenu = [
    { name: 'Productos', icon: 'shopping_cart', to: '/app/products' },
    {name: 'Movimientos', icon: 'swap_horiz', to: '/app/movements'},
]
</script>

<style scoped>
/* header */
.modern-header {
    background: linear-gradient(135deg, #0f2348 0%, #061621 100%);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

/* Sección de usuario en sidebar */
.user-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px 16px;
}

.user-name {
    font-size: 15px;
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
    border-radius: 8px;
    background: transparent;
    color: #bdc3c7;
    margin: 4px 8px;
    padding: 12px 16px;
    transition: all 0.3s ease;
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
    background-color: rgba(255, 255, 255, 0.1);
    color: #ecf0f1;
}

.active-menu-item {
    background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%);
    color: #ffffff;
    box-shadow: 0 4px 12px rgba(30, 64, 175, 0.3);
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
    background: linear-gradient(135deg, #0f2348 0%, #061621 100%);
    color: #ffffff;
}
</style>