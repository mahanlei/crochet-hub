import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/Home.vue'
import WorkDetail from '../pages/WorkDetail.vue'
import AdminList from '../pages/AdminList.vue'
import AdminForm from '../pages/AdminForm.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/works/:id', component: WorkDetail },
  { path: '/admin', component: AdminList },
  { path: '/admin/new', component: AdminForm },
  { path: '/admin/edit/:id', component: AdminForm },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
