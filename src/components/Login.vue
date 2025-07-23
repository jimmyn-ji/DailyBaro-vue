<template>
  <div class="login-container">
    <div class="login-box">
      <el-card class="login-card">
        <div class="title">
          <h2>客服系统</h2>
          <p class="subtitle">与AI对话的理想平台</p>
        </div>
        <el-form 
          :model="loginForm" 
          :rules="loginRules" 
          ref="loginFormRef" 
          class="login-form"
        >
          <div class="form-item">
            <div class="label-box">
              <span class="required">*</span>
              <span class="label">账号</span>
            </div>
            <el-input
              v-model="loginForm.account"
              placeholder="请输入账号"
              class="custom-input">
            </el-input>
          </div>
          <div class="form-item">
            <div class="label-box">
              <span class="required">*</span>
              <span class="label">密码</span>
            </div>
            <el-input
              v-model="loginForm.password"
              type="password"
              placeholder="请输入密码"
              @keyup.enter="handleLogin"
              class="custom-input">
            </el-input>
          </div>
          <div class="btn-container">
            <el-button
              type="primary"
              :loading="loading"
              @click="handleLogin"
              class="login-button">
              登录
            </el-button>
          </div>
          <div class="register-link">
            <el-button type="text" @click="router.push('/register')">
              还没有账号？立即注册
            </el-button>
          </div>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { login } from '@/api/user'

// 路由实例
const router = useRouter()

// 表单引用
const loginFormRef = ref(null)

// 加载状态
const loading = ref(false)

// 登录表单数据
const loginForm = reactive({
  account: '',
  password: ''
})

// 表单验证规则
const loginRules = reactive({
  account: [
    { required: true, message: '请输入账号', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能小于6位', trigger: 'blur' }
  ]
})

/**
 * 处理登录逻辑
 */
const handleLogin = async () => {
  if (!loginFormRef.value) return
  
  await loginFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        loading.value = true
        const result = await login(loginForm)
        const { code, data: user, message } = result.data

        if (code === 1000) {
          // 存储用户信息
          const uid = user.uid ? String(user.uid) : null
          if (!uid) {
            throw new Error('服务器未返回有效用户ID')
          }

          // 保存用户信息到 sessionStorage
          window.sessionStorage.setItem('uid', uid)
          window.sessionStorage.setItem('userInfo', JSON.stringify({
            uid: String(user.uid),
            account: user.account,
            role: user.role
          }))

          ElMessage.success('登录成功')

          // 根据角色跳转不同页面
          if (loginForm.account === 'admin') {
            router.push('/home')
          } else {
            router.push('/chat')
          }
        } else {
          ElMessage.error(message)
        }
      } catch (error) {
        console.error('登录错误:', error)
        ElMessage.error('登录失败，请重试')
      } finally {
        loading.value = false
      }
    }
  })
}
</script>

<style scoped>
.login-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: url('../../static/imgs/back.png') no-repeat center center;
  background-size: cover;
}

.login-box {
  width: 100%;
  max-width: 480px;
  padding: 20px;
}

.login-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  padding: 40px 50px;
}

.title {
  text-align: center;
  margin-bottom: 45px;
}

.title h2 {
  color: #409EFF;
  margin: 0;
  font-size: 28px;
  font-weight: 600;
}

.subtitle {
  color: #909399;
  margin-top: 12px;
  font-size: 14px;
}

.login-form {
  margin: 0 auto;
  width: 100%;
}

.form-item {
  margin-bottom: 30px;
  position: relative;
}

.label-box {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  padding-left: 5px;
}

.required {
  color: #F56C6C;
  margin-right: 4px;
  font-size: 14px;
}

.label {
  font-size: 14px;
  color: #606266;
  font-weight: 500;
}

.custom-input {
  width: 100%;
}

.custom-input :deep(.el-input__inner) {
  height: 42px;
  border-radius: 6px;
  font-size: 14px;
  /* border: 1px solid #dcdfe6; */
  transition: all 0.3s ease;
  padding: 0 15px;
  background: rgba(255, 255, 255, 0.9);
}

.custom-input :deep(.el-input__inner):focus {
  border-color: #409EFF;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.1);
  background: rgba(255, 255, 255, 1);
}

.custom-input :deep(.el-input__inner):hover {
  border-color: #c0c4cc;
}

.btn-container {
  margin-top: 40px;
  padding: 0 15px;
}

.login-button {
  width: 100%;
  height: 44px;
  font-size: 16px;
  font-weight: 500;
  border-radius: 6px;
  background: linear-gradient(to right, #409EFF, #36cfc9);
  border: none;
  transition: all 0.3s ease;
  letter-spacing: 2px;
}

.login-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 5px 15px rgba(64, 158, 255, 0.3);
  opacity: 0.9;
}

.register-link {
  text-align: center;
  margin-top: 25px;
}

.register-link .el-button {
  font-size: 14px;
  color: #606266;
  transition: all 0.3s ease;
  padding: 10px 15px;
}

.register-link .el-button:hover {
  color: #409EFF;
  transform: translateY(-1px);
}

@media screen and (max-width: 480px) {
  .login-box {
    padding: 15px;
  }

  .login-card {
    padding: 30px 25px;
  }

  .title h2 {
    font-size: 24px;
  }
}
</style>
