<template>
  <div class="daily-quote">
    <h2>今日日签</h2>
    <div v-if="quote">{{ quote.content }}</div>
    <input v-model="customQuote" placeholder="输入你的专属日签..." />
    <button @click="saveCustomQuote">生成专属卡片</button>
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
.daily-quote { padding: 20px; }
</style> 