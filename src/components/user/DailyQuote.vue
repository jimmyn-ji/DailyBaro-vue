<template>
  <div class="daily-quote-navbar">
    <span class="quote-content-navbar">{{ quote ? quote.content : '今天也值得被温柔对待' }}</span>
    <el-popover placement="bottom" width="200" trigger="click">
      <template #reference>
        <el-button size="small" class="quote-btn-navbar" :disabled="isModifiedToday">自定义</el-button>
      </template>
      <el-input v-model="customQuote" placeholder="输入你的专属日签" maxlength="30" />
      <el-button type="primary" size="small" @click="saveCustomQuote" style="margin-top:8px;">生成</el-button>
    </el-popover>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import request from '@/utils/request'

const quote = ref(null)
const customQuote = ref('')
const isModifiedToday = ref(false)

async function loadQuote() {
  try {
    // 首先尝试获取自定义日签
    const customResponse = await request.get('/api/quotes/custom')
    console.log('自定义日签接口返回:', customResponse.data)
    if (customResponse.data.code === 200 && customResponse.data.data) {
      quote.value = customResponse.data.data
      // 检查今天是否已经修改过
      const today = new Date()
      const updateTime = new Date(customResponse.data.data.updateTime)
      if (updateTime.toDateString() === today.toDateString()) {
        isModifiedToday.value = true
      }
      return
    }
    
    // 如果没有自定义日签，获取用户专属的随机日签
    const randomResponse = await request.get('/api/quotes/random/user')
    console.log('用户专属随机日签接口返回:', randomResponse.data)
    if (randomResponse.data.code === 200) {
      quote.value = randomResponse.data.data
    } else {
      // 如果都失败了，使用默认日签
      quote.value = { content: '今天也值得被温柔对待' }
    }
  } catch (error) {
    console.error('加载日签失败:', error)
    quote.value = { content: '今天也值得被温柔对待' }
  }
}

async function saveCustomQuote() {
  if (!customQuote.value.trim()) {
    ElMessage.warning('请输入日签内容')
    return
  }
  
  try {
    const response = await request.post('/api/quotes/custom', {
      content: customQuote.value.trim()
    })
    
    if (response.data.code === 200) {
      ElMessage.success('自定义日签设置成功')
      quote.value = response.data.data
      customQuote.value = ''
      isModifiedToday.value = true
    } else {
      ElMessage.error(response.data.message || '设置失败')
    }
  } catch (error) {
    console.error('保存自定义日签失败:', error)
    ElMessage.error('设置失败，请稍后重试')
  }
}

onMounted(() => {
  loadQuote()
})
</script>

<style scoped>
.daily-quote-navbar {
  background: #f0f5f9 !important;
  display: flex;
  align-items: center;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(126,198,230,0.08);
  padding: 0 14px;
  margin-left: 8px;
  min-width: 180px;
  max-width: 240px;
  height: 38px;
}

.quote-content-navbar {
  flex: 1;
  font-size: 13px;
  color: #333;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-right: 8px;
}

.quote-btn-navbar {
  font-size: 11px;
  padding: 4px 8px;
  border-radius: 6px;
  background: rgba(126,198,230,0.1);
  border: 1px solid rgba(126,198,230,0.2);
  color: #7ec6e6;
  transition: all 0.2s;
}

.quote-btn-navbar:hover:not(:disabled) {
  background: rgba(126,198,230,0.2);
  border-color: rgba(126,198,230,0.4);
}

.quote-btn-navbar:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style> 