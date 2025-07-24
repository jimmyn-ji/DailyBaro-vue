<template>
  <div class="quote-bg">
    <div class="quote-card">
      <h2 class="quote-title">今日日签</h2>
      <div v-if="quote" class="quote-content">{{ quote.content }}</div>
      <input v-model="customQuote" class="quote-input" placeholder="输入你的专属日签..." />
      <button class="quote-btn" @click="saveCustomQuote">生成专属卡片</button>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import request from '@/utils/request'
const quote = ref(null)
const customQuote = ref('')
async function loadQuote() {
  const res = await request.get('/api/quotes/random')
  quote.value = res.data.data
}
function saveCustomQuote() {
  quote.value = { content: customQuote.value }
  customQuote.value = ''
}
onMounted(() => { loadQuote() })
</script>
<style scoped>
.quote-bg {
  min-height: 100vh;
  background: linear-gradient(135deg, #7ec6e6 0%, #f7cac9 100%);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 40px 0;
}
.quote-card {
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
.quote-title {
  font-size: 28px;
  font-weight: bold;
  color: #7ec6e6;
  margin-bottom: 10px;
  letter-spacing: 2px;
  text-align: center;
}
.quote-content {
  font-size: 20px;
  color: #333;
  background: #f7fafc;
  border-radius: 10px;
  padding: 18px 16px;
  margin-bottom: 10px;
  box-shadow: 0 2px 8px rgba(126,198,230,0.06);
  text-align: center;
}
.quote-input {
  width: 100%;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  padding: 12px;
  font-size: 16px;
  margin-bottom: 10px;
}
.quote-btn {
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
.quote-btn:hover {
  background: linear-gradient(90deg, #f7cac9, #7ec6e6);
}
</style> 