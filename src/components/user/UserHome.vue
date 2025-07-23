<template>
  <div class="whole">
    <el-container>
      <!-- 头部区域 -->
      <el-header>
        <div class="header-content">
          <div class="logo">
            <h2 style="color: #ffffff; margin: 0;">AI客服系统</h2>
          </div>
          <el-button class="logout" type="warning" @click="logout">退出</el-button>
        </div>
      </el-header>

      <!-- 主体区域 -->
      <el-container>
        <!-- 侧边栏菜单 -->
        <el-aside width="200px">
          <el-menu
              router
              :default-active="defaultUrl"
              class="el-menu-vertical-demo"
              background-color="#f0f5f9"
              text-color="#666666"
              active-text-color="#007bff"
          >
            <el-menu-item index="update_info">
              <i class="el-icon-user"></i>
              <span>个人信息</span>
            </el-menu-item>
          </el-menu>
        </el-aside>

        <!-- 主内容区域 -->
        <el-container>
          <el-main>
            <router-view></router-view>
          </el-main>
        </el-container>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const activeIndex = ref(1)
const defaultUrl = ref('chat')

// 监听路由变化
watch(
    () => route.path,
    () => {
      defaultUrl.value = route.path.replace('/', '')
      console.log(defaultUrl.value)
    }
)

const changePage = (path) => {
  router.push(path)
}

const logout = () => {
  router.push('/login')
}
</script>

<style scoped>
/* 整体布局 */
.whole {
  height: 100vh; /* 满屏高度 */
  background-color: #f0f5f9; /* 淡蓝色背景 */
  overflow: hidden;
}

/* 头部样式 */
.el-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  background-color: #007bff; /* 蓝色背景 */
  color: #ffffff;
  line-height: 60px;
  z-index: 1000;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1); /* 阴影效果 */
  transition: background-color 0.3s ease;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
}

.logo {
  display: flex;
  align-items: center;
}

.logo h2 {
  font-size: 24px;
  font-weight: bold;
  margin-left: 10px;
  color: #ffffff; /* 白色文字 */
  text-shadow: 0 0 5px rgba(255, 255, 255, 0.3); /* 文字阴影 */
}

.logout {
  background-color: #ffffff; /* 白色按钮 */
  border: 1px solid #007bff;
  color: #007bff;
  font-weight: bold;
  transition: background-color 0.3s ease, color 0.3s ease;
  border-radius: 5px; /* 按钮圆角 */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* 按钮阴影 */
}

.logout:hover {
  background-color: #f0f5f9; /* 悬停时淡蓝色 */
  color: #007bff;
}

/* 侧边栏样式 */
.el-aside {
  position: fixed;
  top: 60px;
  left: 0;
  bottom: 0;
  width: 200px;
  background-color: #f0f5f9; /* 淡蓝色背景 */
  z-index: 999;
  box-shadow: 2px 0 12px rgba(0, 0, 0, 0.1); /* 阴影效果 */
  transition: width 0.3s ease;
}

.el-menu {
  border-right: none;
}

.el-menu-item {
  padding: 0 20px !important;
  height: 50px;
  line-height: 50px;
  font-size: 16px;
  transition: background-color 0.3s ease, color 0.3s ease;
  position: relative;
}

.el-menu-item::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  width: 0;
  height: 100%;
  background-color: #e0eaf4;
  z-index: -1;
  transition: width 0.3s ease;
}

.el-menu-item:hover::before,
.el-menu-item.is-active::before {
  width: 100%;
}

.el-menu-item:hover,
.el-menu-item.is-active {
  color: #0056b3 !important; /* 悬停和激活时文字颜色 */
}

.el-menu-item i {
  margin-right: 10px;
}

/* 主内容区域样式 */
.el-main {
  margin-top: 60px;
  margin-left: 200px;
  padding: 20px;
  background-color: #ffffff; /* 白色背景 */
  min-height: calc(100vh - 60px); /* 满屏高度减去头部高度 */
  transition: margin-left 0.3s ease;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.05); /* 主内容区域阴影 */
}

/* 响应式调整 */
@media (max-width: 768px) {
  .el-aside {
    width: 160px;
  }

  .el-main {
    margin-left: 160px;
  }
}
</style>