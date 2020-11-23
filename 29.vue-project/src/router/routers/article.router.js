export default [
  {
    path: '/post',
    component: () => import('@/views/Article/post.vue'),
    meta: {
      needLogin: true
    }
  }
]