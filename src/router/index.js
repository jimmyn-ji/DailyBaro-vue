
import { createRouter, createWebHashHistory } from 'vue-router'
import Login from '@/components/Login.vue'
import Register from '@/components/Register.vue'
import Error from '@/components/utils/404.vue'
import Forbidden from '@/components/utils/403.vue'
// admin/menu
import Home from '@/components/admin/Home.vue'
import UpdateAdminInfo from '@/components/admin/menu/UpdateAdminInfo.vue'
// user
import UserHome from '@/components/user/UserHome.vue'
import Chat from '@/components/user/menu/Chat.vue'

const routes = [
  {
    path: '/',
    redirect: 'login',
  },
  {
    path: '/404',
    meta: {title: "页面走丢了"},
    component: Error
  },
  {
    path: '/403',
    meta: {title: "没有权限"},
    component: Forbidden
  },
  {
    path: '/login',
    name: 'Login',
    meta: {title: "登录"},
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },

  // 用户页面
  {
    path: '/user',
    component: UserHome,
    redirect: '/chat',
    children: [
      {
        path: '/chat',
        meta: {title: "对话"},
        component: Chat
      }
    ]
  },
  // 管理员页面
  {
    path: '/home',
    component: Home,
    // 为 Home 页创建子路由，并默认跳转。
    redirect: '/update_admin_info',
    children: [
      {
        path: '/update_admin_info',
        meta: {title: "个人信息"},
        component: UpdateAdminInfo
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})


export default router