export default [
  {
    path: '/',
    component: () => import('@/views/Home/index.vue')
  },
  {
    path: '*',
    component: () => import('@/views/404.vue')
  }
]