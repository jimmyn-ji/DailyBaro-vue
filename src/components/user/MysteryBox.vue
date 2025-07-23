<template>
  <div class="mystery-box">
    <h2>情绪盲盒</h2>
    <button @click="drawBox">抽取盲盒</button>
    <div v-if="boxContent">
      <h3>今日盲盒</h3>
      <p>{{ boxContent.content }}</p>
      <button v-if="boxContent.content_type==='task' && !completed" @click="markCompleted">标记完成</button>
      <span v-if="completed">已完成，奖励+1</span>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import request from '@/utils/request'
const boxContent = ref(null)
const completed = ref(false)

async function drawBox() {
  const res = await request.post('/api/mystery-box/draw')
  boxContent.value = res.data.data && res.data.data.boxItem ? {
    ...res.data.data.boxItem,
    drawnBoxId: res.data.data.drawnBoxId,
    is_completed: res.data.data.isCompleted || res.data.data.is_completed
  } : null
  completed.value = boxContent.value && boxContent.value.is_completed
}

async function markCompleted() {
  if (!boxContent.value) return
  await request.post(`/api/mystery-box/complete/${boxContent.value.drawnBoxId}`)
  completed.value = true
}
</script>
<style scoped>
.mystery-box { padding: 20px; }
</style> 