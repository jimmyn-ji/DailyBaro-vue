<template>
  <div class="box-bg">
    <div class="box-card">
      <h2 class="box-title">情绪盲盒</h2>
      <button class="draw-btn" :disabled="hasDrawnToday" @click="drawBox">
        {{ hasDrawnToday ? '今日已抽取' : '抽取盲盒' }}
      </button>
      <div v-if="boxContent" class="box-content">
        <h3>今日盲盒</h3>
        <template v-if="boxContent.contentType==='quote'">
          <p>🌈 <b>治愈语录：</b>{{ boxContent.content }}</p>
        </template>
        <template v-else-if="boxContent.contentType==='tip'">
          <p>🧩 <b>情绪管理技巧：</b>{{ boxContent.content }}</p>
        </template>
        <template v-else-if="boxContent.contentType==='task'">
          <p>🎯 <b>今日小任务：</b>{{ boxContent.content }}</p>
          <button v-if="!boxContent.isCompleted" class="complete-btn" @click="markCompleted">标记完成</button>
          <span v-if="boxContent.isCompleted" class="completed-tip">已完成，奖励+1 🎉</span>
        </template>
      </div>
      <transition name="reward-fade">
        <div v-if="showReward" class="reward-popup">情绪能量值 +1</div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import request from '@/utils/request'
const boxContent = ref(null)
const hasDrawnToday = ref(false)
const showReward = ref(false)

async function drawBox() {
  if (hasDrawnToday.value) return
  const res = await request.post('/api/mystery-box/draw')
  if (res.data.code === 200 && res.data.data) {
    boxContent.value = {
      drawnBoxId: res.data.data.drawnBoxId,
      content: res.data.data.content,
      contentType: res.data.data.contentType,
      isCompleted: res.data.data.isCompleted,
      drawTime: res.data.data.drawTime,
      energyReward: res.data.data.energyReward
    }
    hasDrawnToday.value = true
  }
}

async function markCompleted() {
  if (!boxContent.value) return
  const res = await request.post(`/api/mystery-box/complete/${boxContent.value.drawnBoxId}`)
  if (res.data.code === 200) {
    boxContent.value.isCompleted = true
    showReward.value = true
    setTimeout(() => { showReward.value = false }, 1800)
    
    // 通知父组件刷新能量值
    window.dispatchEvent(new CustomEvent('energyUpdated'))
  }
}

// 页面加载时自动获取今日盲盒状态
;(async function init() {
  try {
    const res = await request.get('/api/mystery-box/status')
    console.log('盲盒状态接口返回:', res.data)
    if (res.data.code === 200 && res.data.data) {
      boxContent.value = {
        drawnBoxId: res.data.data.drawnBoxId,
        content: res.data.data.content,
        contentType: res.data.data.contentType,
        isCompleted: res.data.data.isCompleted,
        drawTime: res.data.data.drawTime,
        energyReward: res.data.data.energyReward
      }
      hasDrawnToday.value = true
      console.log('盲盒内容已设置:', boxContent.value)
    } else {
      hasDrawnToday.value = false
    }
  } catch (error) {
    console.error('获取盲盒状态失败:', error)
    hasDrawnToday.value = false
  }
})()
</script>

<style scoped>
.box-bg {
  min-height: 100vh;
  background: #f0f5f9 !important;
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
.draw-btn:disabled {
  background: #e0e0e0;
  color: #aaa;
  cursor: not-allowed;
}
.draw-btn:hover:enabled {
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
.reward-popup {
  position: fixed;
  top: 18%;
  left: 50%;
  transform: translateX(-50%);
  background: #fffbe6;
  color: #f0ad4e;
  font-size: 22px;
  font-weight: bold;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(240,173,78,0.12);
  padding: 18px 36px;
  z-index: 9999;
  animation: pop 0.3s;
}
@keyframes pop {
  0% { transform: translateX(-50%) scale(0.7); opacity: 0; }
  100% { transform: translateX(-50%) scale(1); opacity: 1; }
}
.reward-fade-enter-active, .reward-fade-leave-active {
  transition: opacity 0.8s;
}
.reward-fade-enter-from, .reward-fade-leave-to {
  opacity: 0;
}
</style> 