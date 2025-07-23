<template>
  <div class="whole">
    <el-container>
      <el-header class="header">
        <div>
          <b style="float: left;margin-top: -20px;display: flex">
            <!-- <div style="padding: 30px 10px 0px 0px">
              <img src="../../assets/imgs/logo.png" width="40px" height="40px" alt="">
            </div> -->
            <h2 style="color: #007BFF">客服平台</h2>
          </b>

          <el-button class="logout" type="warning" @click="logout">退出</el-button>
        </div>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <el-menu
              router
              :default-active="activeIndex"
              class="el-menu-vertical-demo"
              background-color="#F0F5F9"
              text-color="#666666"
              active-text-color="#007BFF">

            <el-menu-item index="user_list">
              <i class="el-icon-document"></i>
              <span>客户管理</span>
            </el-menu-item>

            <el-menu-item index="update_admin_info">
              <i class="el-icon-document"></i>
              <span>个人信息</span>
            </el-menu-item>

            <el-menu-item index="product_audit">
              <i class="el-icon-document"></i>
              <span>商品审核</span>
            </el-menu-item>

            <el-menu-item index="product_type">
              <i class="el-icon-document"></i>
              <span>商品类别</span>
            </el-menu-item>

            <el-menu-item index="analyze">
              <i class="el-icon-document"></i>
              <span>数据分析</span>
            </el-menu-item>

            <el-menu-item index="trade">
              <i class="el-icon-document"></i>
              <span>交易管理</span>
            </el-menu-item>

          </el-menu>
        </el-aside>
        <el-container>
          <!--     主体区域     -->
          <el-main>
            <router-view></router-view>
          </el-main>
        </el-container>
      </el-container>

    </el-container>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const activeIndex = ref('user_list')

const changePage = (path) => {
  router.push(path)
}

const logout = () => {
  router.push('/login')
}
</script>

<style scoped>
.whole {
  height: 100vh;
  background-color: #F0F5F9;
}

.el-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background-color: #007BFF;
  color: #FFFFFF;
  text-align: center;
  line-height: 60px;
  z-index: 1000;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.el-header h2 {
  color: #FFFFFF;
}

.logout {
  background-color: #FFFFFF;
  border: none;
  color: #007BFF;
  font-weight: bold;
  transition: background-color 0.3s ease;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.logout:hover {
  background-color: #E0E8F4;
}

.el-aside {
  position: fixed;
  top: 60px;
  left: 0;
  height: 100%;
  background-color: #F0F5F9;
  z-index: 1000;
  box-shadow: 2px 0 12px rgba(0, 0, 0, 0.1);
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
  background-color: #E0E8F4;
  z-index: -1;
  transition: width 0.3s ease;
}

.el-menu-item:hover::before,
.el-menu-item.is-active::before {
  width: 100%;
}

.el-menu-item:hover,
.el-menu-item.is-active {
  color: #007BFF !important;
}

.el-menu-item i {
  margin-right: 10px;
}

.el-main {
  margin-top: 60px;
  margin-left: 220px;
  background-color: #FFFFFF;
  min-height: calc(100vh - 60px);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
}
</style>