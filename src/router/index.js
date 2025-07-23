
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
import Diary from '@/components/user/Diary.vue'
import DiaryEdit from '@/components/user/DiaryEdit.vue'
import DiaryDetail from '@/components/user/DiaryDetail.vue'
import EmotionAnalysis from '@/components/user/EmotionAnalysis.vue'
import MysteryBox from '@/components/user/MysteryBox.vue'
import Capsule from '@/components/user/Capsule.vue'
import DailyQuote from '@/components/user/DailyQuote.vue'
import AnonymousPlanet from '@/components/user/AnonymousPlanet.vue'
import AnonymousPostDetail from '@/components/user/AnonymousPostDetail.vue'

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
    redirect: '/user/diary',
    children: [
      { path: 'diary', component: Diary, meta: {title: '情绪日记本'} },
      { path: 'diary/edit/:id?', component: DiaryEdit, meta: {title: '编辑日记'} },
      { path: 'diary/detail/:id', component: DiaryDetail, meta: {title: '日记详情'} },
      { path: 'analysis', component: EmotionAnalysis, meta: {title: '情绪分析'} },
      { path: 'mysterybox', component: MysteryBox, meta: {title: '情绪盲盒'} },
      { path: 'capsule', component: Capsule, meta: {title: '情绪胶囊'} },
      { path: 'quote', component: DailyQuote, meta: {title: '日签'} },
      { path: 'planet', component: AnonymousPlanet, meta: {title: '匿名星球'} },
      { path: 'planet/detail/:id', component: AnonymousPostDetail, meta: {title: '动态详情'} },
      { path: 'chat', meta: {title: '对话'}, component: Chat }
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