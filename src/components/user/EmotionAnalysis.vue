<template>
  <div class="analysis-bg">
    <div class="analysis-card" ref="analysisContentRef">
      <div class="date-bar">
        <label>开始日期: <input type="date" v-model="startDate" /></label>
        <label>结束日期: <input type="date" v-model="endDate" /></label>
        <button class="refresh-btn" @click="loadCharts">刷新</button>
      </div>
      <div class="explain-bar">
        <span>情绪波动值说明：1为最积极，-1为最消极，0为中性。不同情绪标签有不同分值，波动值为当天所有情绪标签的平均分。</span>
      </div>
      <div id="line-chart" class="chart-box"></div>
      <div id="pie-chart" class="chart-box"></div>
      <div class="ai-analysis">
        <h3>AI分析</h3>
        <div v-if="aiLoading" class="ai-loading">
          <div class="loading-spinner"></div>
          <span>AI正在分析中...</span>
        </div>
        <p v-else>{{ aiText }}</p>
        <button v-if="!aiLoading" class="reanalyze-btn" @click="loadAIText">重新分析</button>
      </div>
      <div class="export-bar">
        <button class="export-btn" @click="exportPDF">导出为PDF</button>
        <button class="export-btn" @click="exportImage">导出为图片</button>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, watch, nextTick } from 'vue'
import * as echarts from 'echarts'
import request from '@/utils/request'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

const aiText = ref('')
const aiLoading = ref(false)
const startDate = ref(new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10))
const endDate = ref(new Date().toISOString().slice(0, 10))
const lineChart = ref(null)
const pieChart = ref(null)
const analysisContentRef = ref(null)
const emotionData = ref({ fluctuation: [], distribution: [] })
const aiCache = ref(new Map()) // 缓存AI分析结果

function formatDate(ts) {
  const d = new Date(ts)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

async function loadCharts() {
  const userId = window.sessionStorage.getItem('uid')
  const params = { userId, startDate: startDate.value, endDate: endDate.value }
  
  try {
    // 并行加载两个图表数据
    const [res1, res2] = await Promise.all([
      request.get('/api/analysis/fluctuation', { params }),
      request.get('/api/analysis/distribution', { params })
    ])
    
  const data1 = res1.data.data || []
    const data2 = res2.data.data || []
    
    // 保存数据用于AI分析
    emotionData.value = { fluctuation: data1, distribution: data2 }
    
    // 渲染图表
    renderCharts(data1, data2)
    
    // 图表加载完成后，延迟加载AI分析
    setTimeout(() => {
      loadAIText()
    }, 500)
    
  } catch (error) {
    console.error('加载图表数据失败:', error)
  }
}

function renderCharts(fluctuationData, distributionData) {
  const xData = fluctuationData.map(d => formatDate(d.date))
  const yData = fluctuationData.map(d => d.value)
  
  const line = echarts.init(document.getElementById('line-chart'))
  line.setOption({
    title: { text: '情绪波动' },
    xAxis: { type: 'category', data: xData },
    yAxis: { type: 'value' },
    series: [{ data: yData, type: 'line', smooth: true }]
  })
  lineChart.value = line
  
  const pie = echarts.init(document.getElementById('pie-chart'))
  pie.setOption({
    title: { text: '情绪分布', left: 'center' },
    tooltip: { trigger: 'item' },
    series: [{ type: 'pie', radius: '50%', data: distributionData.map(d => ({ name: d.emotion, value: d.percentage })) }]
  })
  pieChart.value = pie
}

async function loadAIText() {
  // 检查缓存
  const cacheKey = `${startDate.value}-${endDate.value}`
  if (aiCache.value.has(cacheKey)) {
    aiText.value = aiCache.value.get(cacheKey)
    return
  }
  
  aiLoading.value = true
  
  try {
    // 构建更详细的AI分析请求内容
    const analysisContent = buildAIAnalysisContent()
    
    const res = await request.post('/api/ai/diary-feedback', { 
      diaryContent: analysisContent 
    })
    
    if (res.data.code === 200) {
  aiText.value = res.data.data
      // 缓存结果
      aiCache.value.set(cacheKey, res.data.data)
    } else {
      aiText.value = 'AI分析暂时不可用，请稍后重试。'
    }
  } catch (error) {
    console.error('AI分析失败:', error)
    aiText.value = 'AI分析失败，请检查网络连接后重试。'
  } finally {
    aiLoading.value = false
  }
}

function buildAIAnalysisContent() {
  const { fluctuation, distribution } = emotionData.value
  
  if (!fluctuation.length && !distribution.length) {
    return '暂无情绪数据可供分析'
  }
  
  let content = '请根据以下情绪数据进行分析：\n\n'
  
  // 添加情绪波动数据
  if (fluctuation.length > 0) {
    content += '情绪波动数据：\n'
    fluctuation.forEach(item => {
      content += `${formatDate(item.date)}: ${item.value}\n`
    })
    content += '\n'
  }
  
  // 添加情绪分布数据
  if (distribution.length > 0) {
    content += '情绪分布数据：\n'
    distribution.forEach(item => {
      content += `${item.emotion}: ${item.percentage}%\n`
    })
    content += '\n'
  }
  
  content += '请基于以上数据，分析用户的情绪状态、变化趋势，并给出相应的建议。'
  
  return content
}

function exportPDF() {
  nextTick(() => {
    const el = analysisContentRef.value
    if (!el) return
    html2canvas(el, { useCORS: true, scale: 2 }).then(canvas => {
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
      pdf.save('情绪分析.pdf')
    })
  })
}

function exportImage() {
  nextTick(() => {
    const el = analysisContentRef.value
    if (!el) return
    html2canvas(el, { useCORS: true, scale: 2 }).then(canvas => {
      const imgData = canvas.toDataURL('image/png')
    const a = document.createElement('a')
      a.href = imgData
      a.download = '情绪分析.png'
    a.click()
    })
  })
}

onMounted(() => {
  loadCharts()
})

watch([startDate, endDate], () => {
  loadCharts()
})
</script>
<style scoped>
.analysis-bg {
  min-height: 100vh;
  background: #f0f5f9 !important;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 20px 0;
}
.analysis-card, .chart-box, .ai-analysis, .export-bar, .date-bar {
  background: transparent !important;
  box-shadow: none !important;
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
  background: rgba(255,255,255,0.88);
  border-radius: 16px;
  margin-bottom: 18px;
  box-shadow: 0 2px 8px rgba(126,198,230,0.09);
}
.ai-analysis {
  background: rgba(255,255,255,0.88);
  border-radius: 16px;
  padding: 16px 14px;
  margin-bottom: 10px;
  box-shadow: 0 2px 8px rgba(126,198,230,0.09);
}
.ai-loading {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #666;
}
.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #7ec6e6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
.reanalyze-btn {
  background: linear-gradient(90deg, #7ec6e6, #f7cac9);
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 6px 16px;
  font-size: 14px;
  font-weight: bold;
  margin-top: 10px;
  cursor: pointer;
  transition: background 0.2s;
}
.reanalyze-btn:hover {
  background: linear-gradient(90deg, #f7cac9, #7ec6e6);
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
.explain-bar {
  background: rgba(255,255,255,0.88);
  border-radius: 10px;
  padding: 8px 16px;
  margin-bottom: 10px;
  color: #666;
  font-size: 15px;
  text-align: center;
}
</style> 