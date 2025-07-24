<template>
  <div class="capsule-bg">
    <div class="capsule-card">
      <h2 class="capsule-title">情绪胶囊</h2>
      <textarea v-model="content" class="capsule-textarea" placeholder="写下你的情绪、想法或目标..." />
      <input type="file" multiple @change="handleFileChange" class="file-input" />
      <input type="datetime-local" v-model="openTime" class="capsule-input" />
      <select v-model="reminderType" class="capsule-select">
        <option value="app_notification">应用内通知</option>
        <option value="sms">短信提醒</option>
      </select>
      <button class="capsule-btn" @click="saveCapsule">保存胶囊</button>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import request from '@/utils/request'
const content = ref('')
const openTime = ref('')
const reminderType = ref('app_notification')
const mediaFiles = ref([])
function handleFileChange(e) { mediaFiles.value = Array.from(e.target.files) }
async function saveCapsule() {
  const form = new FormData()
  form.append('content', content.value)
  form.append('openTime', openTime.value)
  form.append('reminderType', reminderType.value)
  mediaFiles.value.forEach(f => form.append('mediaFiles', f))
  await request.post('/api/capsules', form)
  alert('保存成功！')
  content.value = ''
  openTime.value = ''
  reminderType.value = 'app_notification'
  mediaFiles.value = []
}
</script>
<style scoped>
.capsule-bg {
  min-height: 100vh;
  background: linear-gradient(135deg, #7ec6e6 0%, #f7cac9 100%);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 40px 0;
}
.capsule-card {
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 8px 32px rgba(126,198,230,0.10);
  padding: 36px 32px 32px 32px;
  width: 500px;
  max-width: 95vw;
  display: flex;
  flex-direction: column;
  gap: 18px;
  align-items: center;
}
.capsule-title {
  font-size: 28px;
  font-weight: bold;
  color: #7ec6e6;
  margin-bottom: 10px;
  letter-spacing: 2px;
  text-align: center;
}
.capsule-textarea {
  width: 100%;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  padding: 12px;
  font-size: 16px;
  min-height: 80px;
  margin-bottom: 10px;
  resize: vertical;
}
.file-input {
  margin-bottom: 10px;
}
.capsule-input {
  width: 100%;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  padding: 10px;
  font-size: 15px;
  margin-bottom: 10px;
}
.capsule-select {
  width: 100%;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  padding: 10px;
  font-size: 15px;
  margin-bottom: 10px;
}
.capsule-btn {
  background: linear-gradient(90deg, #7ec6e6, #f7cac9);
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 10px 28px;
  font-size: 16px;
  font-weight: bold;
  box-shadow: 0 2px 8px rgba(126,198,230,0.15);
  cursor: pointer;
  transition: background 0.2s;
}
.capsule-btn:hover {
  background: linear-gradient(90deg, #f7cac9, #7ec6e6);
}
</style> 