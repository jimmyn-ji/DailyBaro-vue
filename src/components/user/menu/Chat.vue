<template>
  <div class="chat-bg">
    <div class="chat-card">
        <div class="title">
        <h2 class="chat-title">智能问答</h2>
        <p class="subtitle">与AI对话，获得情绪建议与关怀</p>
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
              placeholder="请输入你的问题，如‘如何缓解压力’"
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
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input: inputMessage.value })
    })
    if (!response.ok) throw new Error('请求失败')
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
.chat-bg {
  min-height: 100vh;
  background: linear-gradient(135deg, #7ec6e6 0%, #f7cac9 100%);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 40px 0;
}
.chat-card {
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 8px 32px rgba(126,198,230,0.10);
  padding: 36px 32px 32px 32px;
  width: 600px;
  max-width: 95vw;
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.chat-title {
  font-size: 28px;
  font-weight: bold;
  color: #7ec6e6;
  margin-bottom: 6px;
  letter-spacing: 2px;
  text-align: center;
}
.subtitle {
  color: #909399;
  margin-top: 0;
  font-size: 15px;
  text-align: center;
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
  background: #f7fafc;
  border-radius: 8px;
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
  background: #7ec6e6;
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
  border-color: #7ec6e6;
  box-shadow: 0 0 0 2px rgba(126,198,230,0.1);
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
  background: linear-gradient(90deg, #7ec6e6, #f7cac9);
  border: none;
  transition: all 0.3s ease;
  letter-spacing: 2px;
  color: #fff;
}
.send-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 5px 15px rgba(126,198,230,0.13);
  opacity: 0.9;
}
</style>