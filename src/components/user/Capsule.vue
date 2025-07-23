<template>
  <div class="capsule">
    <h2>情绪胶囊</h2>
    <textarea v-model="content" placeholder="写下你的情绪、想法或目标..." />
    <input type="file" multiple @change="handleFileChange" />
    <input type="datetime-local" v-model="openTime" />
    <select v-model="reminderType">
      <option value="app_notification">应用内通知</option>
      <option value="sms">短信提醒</option>
    </select>
    <button @click="saveCapsule">保存胶囊</button>
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
.capsule { padding: 20px; }
</style> 