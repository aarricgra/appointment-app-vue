import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ChartClientes from '../components/ChartReservas.vue'
import CalendarView from '../views/CalendarView.vue'
import AppointmentView from '../views/AppointmentView.vue'
import ServicesView from '../views/ServicesView.vue'
import ServiceView from '../views/ServiceView.vue'
import ProductsView from '../views/ProductsView.vue'
import ProductView from '../views/ProductView.vue'
import ClientsView from '../views/ClientsView.vue'
import ClientView from '../views/ClientView.vue'
import ImportView from '../views/ImportView.vue'
import ExportView from '../views/ExportView.vue'



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
      component: ChartClientes
    },
    {
      path: '/servicios',
      name: 'servicios',
      component: ServicesView
    },
    {
      path: '/appointmet/:id',
      name: 'appointment',
      component: AppointmentView,
      props:true
    },
    {
      path: '/servicio/:id',
      name: 'servicio',
      component: ServiceView,
      props:true
    },
    {
      path: '/productos',
      name: 'productos',
      component: ProductsView
    },
    {
      path: '/producto/:id',
      name: 'producto',
      component: ProductView,
      props:true
    },
    {
      path: '/clientes',
      name: 'clientes',
      component: ClientsView
    },
    {
      path: '/cliente/:id',
      name: 'cliente',
      component: ClientView,
      props:true
    },
    {
      path: '/import',
      name: 'importar',
      component: ImportView,
    },
    {
      path: '/export',
      name: 'exportar',
      component: ExportView,
    },
  ]
})

export default router
