<template>
  <div class="box-bg">
    <div class="box-card">
      <h2 class="box-title">情绪盲盒</h2>
      <button class="draw-btn" @click="drawBox">抽取盲盒</button>
      <div v-if="boxContent" class="box-content">
        <h3>今日盲盒</h3>
        <p>{{ boxContent.content }}</p>
        <button v-if="boxContent.content_type==='task' && !completed" class="complete-btn" @click="markCompleted">标记完成</button>
        <span v-if="completed" class="completed-tip">已完成，奖励+1</span>
      </div>
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
.box-bg {
  min-height: 100vh;
  background: linear-gradient(135deg, #7ec6e6 0%, #f7cac9 100%);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 40px 0;
}
.box-card {
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
.box-title {
  font-size: 28px;
  font-weight: bold;
  color: #7ec6e6;
  margin-bottom: 10px;
  letter-spacing: 2px;
  text-align: center;
}
.draw-btn {
  background: linear-gradient(90deg, #7ec6e6, #f7cac9);
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 10px 28px;
  font-size: 16px;
  font-weight: bold;
  box-shadow: 0 2px 8px rgba(126,198,230,0.15);
  margin-bottom: 10px;
  cursor: pointer;
  transition: background 0.2s;
}
.draw-btn:hover {
  background: linear-gradient(90deg, #f7cac9, #7ec6e6);
}
.box-content {
  background: #f7fafc;
  border-radius: 10px;
  padding: 18px 16px;
  margin-bottom: 10px;
  box-shadow: 0 2px 8px rgba(126,198,230,0.06);
  text-align: center;
  width: 100%;
}
.complete-btn {
  background: #f0ad4e;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 8px 18px;
  font-size: 15px;
  font-weight: bold;
  box-shadow: 0 2px 8px rgba(240,173,78,0.10);
  cursor: pointer;
  margin-top: 10px;
}
.completed-tip {
  color: #7ec6e6;
  font-size: 15px;
  font-weight: bold;
  margin-top: 10px;
  display: block;
}
</style> 