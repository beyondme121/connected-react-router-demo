export default [
  {
    path: '/login',
    component: () => import('@/views/User/login.vue')
  },
  {
    path: '/reg',
    component: () => import('@/views/User/reg.vue')
  },
  {
    path: '/forget',
    component: () => import('@/views/User/forget.vue')
  }
]