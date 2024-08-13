import { createRouter, createWebHistory } from 'vue-router'
import OrderPage from '../views/OrderPage.vue'
import QueryPage from '../views/QueryPage.vue'
import ImagePage from '../views/ImagePage.vue'

const routes = [
  {
    path: '/',
    name: 'order',
    component: OrderPage
  },
  {
    path: '/query',
    name: 'query',
    component: QueryPage
  },
  {
    path: '/image',
    name: 'image',
    component: ImagePage
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
