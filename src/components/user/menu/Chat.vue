<template>
  <div class="chat-container">
    <div class="chat-box">
      <el-card class="chat-card">
        <div class="title">
          <h2>客服系统</h2>
          <p class="subtitle">与AI对话的理想平台</p>
        </div>
        <div class="chat-content">
          <div class="chat-history">
            <div v-for="(message, index) in messages" :key="index" :class="['message', message.role]">
              <div class="message-content">{{ message.content }}</div>
            </div>
          </div>
          <div class="chat-input">
            <el-input
                v-model="inputMessage"
                placeholder="请输入你的问题"
                @keyup.enter="sendMessage"
                class="custom-input"
            ></el-input>
            <el-button
                type="primary"
                :loading="loading"
                @click="sendMessage"
                class="send-button"
            >
              发送
            </el-button>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const inputMessage = ref('')
const loading = ref(false)
const messages = ref([])

const sendMessage = async () => {
  if (!inputMessage.value.trim()) {
    ElMessage.warning('请输入问题')
    return
  }

  loading.value = true
  messages.value.push({ role: 'user', content: inputMessage.value })

  try {
    const response = await fetch('http://127.0.0.1:8081/ai/streamChat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ input: inputMessage.value })
    })

    if (!response.ok) {
      throw new Error('请求失败')
    }

    const data = await response.json()
    if (data.success) {
      messages.value.push({ role: 'ai', content: data.data })
    } else {
      ElMessage.error(data.message || 'AI 服务返回错误')
    }
  } catch (error) {
    ElMessage.error('请求失败，请重试')
    console.error('请求错误:', error)
  } finally {
    loading.value = false
    inputMessage.value = ''
  }
}
</script>


<style scoped>
.chat-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: url('../../static/imgs/back.png') no-repeat center center;
  background-size: cover;
}

.chat-box {
  width: 100%;
  max-width: 800px;
  padding: 20px;
}

.chat-card {
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

.chat-content {
  display: flex;
  flex-direction: column;
  height: 500px;
}

.chat-history {
  flex: 1;
  overflow-y: auto;
  margin-bottom: 20px;
  padding: 10px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 6px;
  border: 1px solid #dcdfe6;
}

.message {
  margin-bottom: 15px;
}

.message-content {
  padding: 10px;
  border-radius: 6px;
  background: #f0f0f0;
  color: #333;
}

.message.ai .message-content {
  background: #409EFF;
  color: white;
}

.chat-input {
  display: flex;
  gap: 10px;
}

.custom-input {
  flex: 1;
}

.custom-input :deep(.el-input__inner) {
  height: 42px;
  border-radius: 6px;
  font-size: 14px;
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

.send-button {
  height: 42px;
  font-size: 16px;
  font-weight: 500;
  border-radius: 6px;
  background: linear-gradient(to right, #409EFF, #36cfc9);
  border: none;
  transition: all 0.3s ease;
  letter-spacing: 2px;
}

.send-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 5px 15px rgba(64, 158, 255, 0.3);
  opacity: 0.9;
}

@media screen and (max-width: 480px) {
  .chat-box {
    padding: 15px;
  }

  .chat-card {
    padding: 30px 25px;
  }

  .title h2 {
    font-size: 24px;
  }
}
</style>