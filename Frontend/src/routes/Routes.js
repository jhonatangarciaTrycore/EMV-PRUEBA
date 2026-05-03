import { createRouter, createWebHashHistory } from "vue-router"
import Layout from "../layouts/layout.vue"
import Projects from "../views/projects.vue"
import ProjectDetail from "../views/project-detail.vue"


const routes = [
    {
        path: '/',
        redirect: '/app/projects'
    },
    {
        path: '/app',
        component: Layout,
        children: [
            {
                path: 'projects',
                component: Projects
            },
            {
                path: 'projects/:id',
                component: ProjectDetail
            }
        ]
    }
]

export const router = createRouter({
    history: createWebHashHistory(),
    routes
})