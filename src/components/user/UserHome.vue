<template>
  <div class="whole-bg">
    <div class="user-header">
      <div style="display: flex; align-items: center;">
        <img class="avatar-img" src="/src/assets/assets/imgs/bghalf-2.jpg" alt="avatar" @click="goUpdateInfo" title="点击修改个人信息" />
        <DailyQuote />
      </div>
      <span class="header-title">情绪日记本</span>
      <el-button class="logout" type="warning" @click="logout">退出</el-button>
    </div>
    <el-container>
      <el-aside width="200px">
        <el-menu
          :default-active="defaultUrl"
          class="el-menu-vertical-demo"
          background-color="#f0f5f9"
          text-color="#666666"
          active-text-color="#7ec6e6"
          @select="handleMenuSelect"
        >
          <el-menu-item index="diary">
            <i class="el-icon-notebook-1"></i>
            <span>情绪日记本</span>
          </el-menu-item>
          <el-menu-item index="analysis">
            <i class="el-icon-data-analysis"></i>
            <span>情绪分析</span>
          </el-menu-item>
          <el-menu-item index="chat">
            <i class="el-icon-chat-dot-round"></i>
            <span>智能问答</span>
          </el-menu-item>
          <el-menu-item index="planet">
            <i class="el-icon-star-on"></i>
            <span>匿名星球</span>
          </el-menu-item>
          <el-menu-item index="quote">
            <i class="el-icon-sunrise"></i>
            <span>日签展示</span>
          </el-menu-item>
          <el-menu-item index="capsule">
            <i class="el-icon-coin"></i>
            <span>情绪胶囊</span>
            <span v-if="unreadReminders.length > 0" class="red-dot"></span>
          </el-menu-item>
          <el-menu-item index="mysterybox">
            <i class="el-icon-present"></i>
            <span>情绪盲盒</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
    <el-dialog v-model="showCapsuleReminder" title="情绪胶囊提醒" width="400px" :close-on-click-modal="false">
      <div v-for="reminder in unreadReminders" :key="reminder.capsuleId" style="margin-bottom: 12px;">
        <div>您的情绪胶囊已到开启时间：{{ reminder.openTime }}</div>
        <div>内容预览：{{ reminder.content ? reminder.content.slice(0, 30) : '（无内容）' }}</div>
        <el-button size="small" type="primary" @click="markRead(reminder.capsuleId)">我知道了</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import DailyQuote from './DailyQuote.vue'
import request from '@/utils/request'
const router = useRouter()
const route = useRoute()
const defaultUrl = ref('diary')
watch(
  () => route.path,
  () => {
    defaultUrl.value = route.path.replace('/user/', '')
  }
)
const logout = () => {
  router.push('/login')
}
const handleMenuSelect = (index) => {
  router.push(`/user/${index}`)
}
const goUpdateInfo = () => {
  router.push('/user/update_info')
}

// --------- 胶囊提醒相关 ---------
const unreadReminders = ref([])
const showCapsuleReminder = ref(false)

async function loadUnreadReminders() {
  try {
    const res = await request.get('/api/capsules/reminders/unread')
    if (res.data.code === 200) {
      unreadReminders.value = res.data.data || []
      showCapsuleReminder.value = unreadReminders.value.length > 0
    }
  } catch (e) {}
}

async function markRead(capsuleId) {
  await request.post(`/api/capsules/reminders/read/${capsuleId}`)
  unreadReminders.value = unreadReminders.value.filter(r => r.capsuleId !== capsuleId)
  if (unreadReminders.value.length === 0) showCapsuleReminder.value = false
}

onMounted(() => {
  loadUnreadReminders()
})
</script>

<style scoped>
.whole-bg {
  min-height: 100vh;
  background: url('@/static/imgs/back.png') no-repeat center center;
  background-size: cover;
}
.user-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 30px;
  height: 70px;
  background: transparent !important;
  box-shadow: 0 2px 12px rgba(126,198,230,0.08);
}
.el-aside {
  background: transparent !important;
  position: relative;
}
.el-menu {
  background: transparent !important;
}
.el-main {
  background: transparent !important;
  min-height: calc(100vh - 70px);
  border-radius: 16px 0 0 0;
  margin: 20px 20px 20px 0;
  box-shadow: 0 0 10px rgba(0,0,0,0.05);
  padding: 30px;
}
.avatar-img {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  margin-right: 18px;
  cursor: pointer;
  object-fit: cover;
  border: 2px solid #7ec6e6;
}
.header-title {
  font-size: 22px;
  font-weight: bold;
  color: #7ec6e6;
  letter-spacing: 2px;
}
.logout {
  margin-left: 20px;
}
.red-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  background: red;
  border-radius: 50%;
  margin-left: 4px;
}
</style> 