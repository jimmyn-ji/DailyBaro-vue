<template>
  <div class="analysis-bg">
    <div class="analysis-card">
      <h2 class="analysis-title">情绪分析</h2>
      <div class="date-bar">
        <label>开始日期: <input type="date" v-model="startDate" /></label>
        <label>结束日期: <input type="date" v-model="endDate" /></label>
        <button class="refresh-btn" @click="loadCharts">刷新</button>
      </div>
      <div id="line-chart" class="chart-box"></div>
      <div id="pie-chart" class="chart-box"></div>
      <div class="ai-analysis">
        <h3>AI分析</h3>
        <p>{{ aiText }}</p>
      </div>
      <div class="export-bar">
        <button class="export-btn" @click="exportPDF">导出为PDF</button>
        <button class="export-btn" @click="exportImage">导出为图片</button>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'
import request from '@/utils/request'
const aiText = ref('')
const startDate = ref(new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10))
const endDate = ref(new Date().toISOString().slice(0, 10))
const lineChart = ref(null)
const pieChart = ref(null)
async function loadCharts() {
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
  const res = await request.post('/api/ai/diary-feedback', { diaryContent: '请根据近一周情绪数据生成分析' })
  aiText.value = res.data.data
}
function exportPDF() {
  window.open(`/api/export/analysis.pdf?startDate=${startDate.value}&endDate=${endDate.value}`)
}
function exportImage() {
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
.analysis-bg {
  min-height: 100vh;
  background: linear-gradient(135deg, #7ec6e6 0%, #f7cac9 100%);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 40px 0;
}
.analysis-card {
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 8px 32px rgba(126,198,230,0.10);
  padding: 36px 32px 32px 32px;
  width: 700px;
  max-width: 98vw;
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.analysis-title {
  font-size: 32px;
  font-weight: bold;
  color: #7ec6e6;
  margin-bottom: 10px;
  letter-spacing: 2px;
  text-align: center;
}
.date-bar {
  display: flex;
  gap: 18px;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
}
.refresh-btn {
  background: linear-gradient(90deg, #7ec6e6, #f7cac9);
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 8px 22px;
  font-size: 16px;
  font-weight: bold;
  box-shadow: 0 2px 8px rgba(126,198,230,0.15);
  cursor: pointer;
  transition: background 0.2s;
}
.refresh-btn:hover {
  background: linear-gradient(90deg, #f7cac9, #7ec6e6);
}
.chart-box {
  width: 100%;
  height: 300px;
  background: #f7fafc;
  border-radius: 12px;
  margin-bottom: 18px;
  box-shadow: 0 2px 8px rgba(126,198,230,0.06);
}
.ai-analysis {
  background: #f7fafc;
  border-radius: 10px;
  padding: 18px 16px;
  margin-bottom: 10px;
  box-shadow: 0 2px 8px rgba(126,198,230,0.06);
}
.export-bar {
  display: flex;
  gap: 18px;
  justify-content: center;
  margin-top: 10px;
}
.export-btn {
  background: linear-gradient(90deg, #7ec6e6, #f7cac9);
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 10px 28px;
  font-size: 16px;
  font-weight: bold;
  box-shadow: 0 2px 8px rgba(126,198,230,0.15);
  cursor: pointer;
  transition: background 0.2s;
}
.export-btn:hover {
  background: linear-gradient(90deg, #f7cac9, #7ec6e6);
}
</style> 