import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

// 配置路由表
const routes = [{
  path: '/login',
  component: () => import ('@/views/login')
},
{
  path: '/',
  component: () => import ('@/views/tab-bar'),
  children: [
    {
      path: '', // 默认子路由
      name: 'home',
      component: () => import('@/views/home')
    },
    {
      path: '/qa',
      name: 'qa',
      component: () => import('@/views/qa')
    },
    {
      path: '/video',
      name: 'video',
      component: () => import('@/views/video')
    },
    {
      path: '/my',
      name: 'my',
      component: () => import('@/views/my')
    }
  ]
},
// 用户页面
{
  path: '/user/:userId',
  name: 'user',
  component: () => import('@/views/user')
},
// 搜索页面
{
  path: '/search',
  name: 'search',
  component: () => import('@/views/search')
}
]

const router = new VueRouter({
  routes
})

export default router
