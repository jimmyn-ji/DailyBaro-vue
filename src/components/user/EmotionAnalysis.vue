<template>
  <div class="emotion-analysis">
    <h2>情绪分析</h2>
    <div>
      <label>开始日期: <input type="date" v-model="startDate" /></label>
      <label>结束日期: <input type="date" v-model="endDate" /></label>
      <button @click="loadCharts">刷新</button>
    </div>
    <div id="line-chart" style="height:300px;"></div>
    <div id="pie-chart" style="height:300px;"></div>
    <div class="ai-analysis">
      <h3>AI分析</h3>
      <p>{{ aiText }}</p>
    </div>
    <button @click="exportPDF">导出为PDF</button>
    <button @click="exportImage">导出为图片</button>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'
import request from '@/utils/request'

const aiText = ref('')
const startDate = ref(new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)) // 近7天
const endDate = ref(new Date().toISOString().slice(0, 10))
const lineChart = ref(null)
const pieChart = ref(null)

async function loadCharts() {
  // 折线图
  const res1 = await request.get('/api/analysis/fluctuation', { params: { startDate: startDate.value, endDate: endDate.value } })
  const data1 = res1.data.data || []
  const xData = data1.map(d => d.date)
  const yData = data1.map(d => d.emotionScore)
  const line = echarts.init(document.getElementById('line-chart'))
  line.setOption({
    title: { text: '情绪波动' },
    xAxis: { type: 'category', data: xData },
    yAxis: { type: 'value' },
    series: [{ data: yData, type: 'line', smooth: true }]
  })
  lineChart.value = line
  // 饼图
  const res2 = await request.get('/api/analysis/distribution', { params: { startDate: startDate.value, endDate: endDate.value } })
  const data2 = res2.data.data || []
  const pie = echarts.init(document.getElementById('pie-chart'))
  pie.setOption({
    title: { text: '情绪分布', left: 'center' },
    tooltip: { trigger: 'item' },
    series: [{ type: 'pie', radius: '50%', data: data2.map(d => ({ name: d.emotion, value: d.count })) }]
  })
  pieChart.value = pie
}

async function loadAIText() {
  // 这里可拼接一段分析内容
  const res = await request.post('/api/ai/diary-feedback', { diaryContent: '请根据近一周情绪数据生成分析' })
  aiText.value = res.data.data
}

function exportPDF() {
  window.open(`/api/export/analysis.pdf?startDate=${startDate.value}&endDate=${endDate.value}`)
}
function exportImage() {
  // 导出折线图为图片
  if (lineChart.value) {
    const url = lineChart.value.getDataURL({ type: 'png' })
    const a = document.createElement('a')
    a.href = url
    a.download = 'emotion-line.png'
    a.click()
  }
}

onMounted(() => {
  loadCharts()
  loadAIText()
})
</script>
<style scoped>
.emotion-analysis { padding: 20px; }
</style> 