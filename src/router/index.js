import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ChartClientes from '../components/ChartReservas.vue'
import ChartServicios from '@/components/ChartServicios.vue'
import CalendarView from '../views/CalendarView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/calendar',
      name: 'calendar',
      component: CalendarView
    },
    {
      path: '/clientes',
      name: 'clientes',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: ChartClientes
    },
    {
      path: '/servicios',
      name: 'servicios',
      component: ChartServicios
    }
  ]
})

export default router
