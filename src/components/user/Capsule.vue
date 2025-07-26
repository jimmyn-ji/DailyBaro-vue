<template>
  <div class="capsule-bg">
    <div class="capsule-card">
      <h2 class="capsule-title">情绪胶囊</h2>
      <p class="capsule-subtitle">记录当下的情绪，为未来的自己留下一份珍贵的回忆</p>
      
      <div class="form-group">
        <label class="form-label">情绪内容</label>
        <textarea 
          v-model="content" 
          class="capsule-textarea" 
          placeholder="写下你当下的情绪、想法、目标或想对未来的自己说的话..."
          maxlength="500"
        />
        <div class="char-count">{{ content.length }}/500</div>
      </div>

      <div class="form-group">
        <label class="form-label">开启时间</label>
        <input 
          type="datetime-local" 
          v-model="openTime" 
          class="capsule-input"
          :min="minDateTime"
        />
        <div class="time-presets">
          <button 
            v-for="preset in timePresets" 
            :key="preset.label"
            @click="setPresetTime(preset.value)"
            class="preset-btn"
            :class="{ active: isPresetActive(preset.value) }"
          >
            {{ preset.label }}
          </button>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">提醒方式</label>
        <select v-model="reminderType" class="capsule-select">
          <option value="app_notification">应用内通知</option>
          <option value="sms">短信提醒</option>
        </select>
      </div>

      <div class="form-group">
        <label class="form-label">添加素材 (可选)</label>
        <div class="file-upload-area" @click="triggerFileInput">
          <div v-if="mediaFiles.length === 0" class="upload-placeholder">
            <div class="upload-icon">📎</div>
            <p>点击添加照片、音频等素材</p>
            <p class="upload-hint">支持图片、音频(MP3/WAV/OGG/AAC/NCM等)、视频文件</p>
          </div>
          <div v-else class="file-list">
            <div v-for="(file, index) in mediaFiles" :key="index" class="file-item">
              <span class="file-name">{{ file.name }}</span>
              <button @click="removeFile(index)" class="remove-btn">×</button>
            </div>
          </div>
        </div>
        <input 
          ref="fileInput"
          type="file" 
          multiple 
          @change="handleFileChange" 
          class="file-input-hidden"
          accept="image/*,audio/*,video/*,.ncm,.m4a,.aac"
        />
      </div>

      <button 
        class="capsule-btn" 
        @click="saveCapsule"
        :disabled="!isFormValid"
        :class="{ disabled: !isFormValid }"
      >
        {{ isSaving ? '保存中...' : '保存胶囊' }}
      </button>
    </div>
    <div class="capsule-list-card">
      <h3 class="capsule-list-title">我的情绪胶囊</h3>
      <div v-if="capsuleList.length === 0" class="capsule-empty">暂无胶囊</div>
      <div v-else class="capsule-list">
        <div v-for="item in capsuleList" :key="item.capsuleId" class="capsule-list-item">
          <div class="capsule-list-content">{{ item.content ? item.content.slice(0, 30) : '（无内容）' }}</div>
          <div class="capsule-list-time">开启时间：{{ formatTime(item.openTime) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import request from '@/utils/request'

const content = ref('')
const openTime = ref('')
const reminderType = ref('app_notification')
const mediaFiles = ref([])
const isSaving = ref(false)
const fileInput = ref(null)
const capsuleList = ref([])

// 预设时间选项
const timePresets = [
  { label: '1周后', value: 7 },
  { label: '1个月后', value: 30 },
  { label: '3个月后', value: 90 },
  { label: '6个月后', value: 180 },
  { label: '1年后', value: 365 }
]

// 最小时间（当前时间）
const minDateTime = computed(() => {
  const now = new Date()
  return now.toISOString().slice(0, 16)
})

// 表单验证
const isFormValid = computed(() => {
  return content.value.trim() && openTime.value
})

// 设置预设时间
function setPresetTime(days) {
  const futureDate = new Date()
  futureDate.setDate(futureDate.getDate() + days)
  openTime.value = futureDate.toISOString().slice(0, 16)
}

// 检查预设时间是否激活
function isPresetActive(days) {
  if (!openTime.value) return false
  const selectedDate = new Date(openTime.value)
  const expectedDate = new Date()
  expectedDate.setDate(expectedDate.getDate() + days)
  return Math.abs(selectedDate.getTime() - expectedDate.getTime()) < 24 * 60 * 60 * 1000 // 1天内的误差
}

// 触发文件选择
function triggerFileInput() {
  fileInput.value.click()
}

// 处理文件选择
function handleFileChange(e) {
  const files = Array.from(e.target.files)
  const validFiles = files.filter(file => {
    // 支持的文件类型
    const supportedTypes = [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/bmp',
      'audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/aac', 'audio/m4a',
      'video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/flv',
      'audio/ncm', 'audio/x-ncm' // 添加NCM格式支持（网易云音乐）
    ]
    
    const isValid = supportedTypes.includes(file.type) || 
                   file.name.toLowerCase().endsWith('.ncm') ||
                   file.name.toLowerCase().endsWith('.m4a') ||
                   file.name.toLowerCase().endsWith('.aac')
    
    if (!isValid) {
      ElMessage.warning(`不支持的文件类型: ${file.name}`)
    }
    return isValid
  })
  
  mediaFiles.value.push(...validFiles)
  
  // 清空input，允许重复选择相同文件
  e.target.value = ''
}

// 移除文件
function removeFile(index) {
  mediaFiles.value.splice(index, 1)
}

// 保存胶囊
async function saveCapsule() {
  if (!isFormValid.value) {
    ElMessage.warning('请填写完整信息')
    return
  }

  isSaving.value = true

  try {
    const form = new FormData()
    form.append('content', content.value.trim())
    form.append('openTime', openTime.value)
    form.append('reminderType', reminderType.value)
    
    mediaFiles.value.forEach(file => {
      form.append('mediaFiles', file)
    })

    const response = await request.post('/api/capsules', form)
    
    if (response.data.code === 200) {
      ElMessage.success('情绪胶囊保存成功！')
      resetForm()
      loadCapsuleList() // 保存成功后刷新列表
    } else {
      ElMessage.error(response.data.message || '保存失败')
    }
  } catch (error) {
    console.error('保存胶囊失败:', error)
    ElMessage.error('保存失败，请稍后重试')
  } finally {
    isSaving.value = false
  }
}

// 重置表单
function resetForm() {
  content.value = ''
  openTime.value = ''
  reminderType.value = 'app_notification'
  mediaFiles.value = []
}

function formatTime(time) {
  if (!time) return ''
  const d = new Date(time)
  return d.toLocaleString()
}

async function loadCapsuleList() {
  try {
    const res = await request.get('/api/capsules')
    if (res.data.code === 200) {
      capsuleList.value = res.data.data || []
    }
  } catch (e) {}
}

onMounted(() => {
  // 设置默认开启时间为1个月后
  setPresetTime(30)
  loadCapsuleList()
})
</script>

<style scoped>
.capsule-bg {
  min-height: 100vh;
  background: #f0f5f9 !important;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 40px 0;
}

.capsule-card {
  background: rgba(255,255,255,0.88);
  border-radius: 18px;
  box-shadow: 0 8px 32px rgba(126,198,230,0.10);
  padding: 36px 32px 32px 32px;
  width: 600px;
  max-width: 95vw;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.capsule-title {
  font-size: 28px;
  font-weight: bold;
  color: #7ec6e6;
  margin-bottom: 5px;
  letter-spacing: 2px;
  text-align: center;
}

.capsule-subtitle {
  color: #666;
  text-align: center;
  margin-bottom: 20px;
  font-size: 14px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-weight: 600;
  color: #333;
  font-size: 15px;
}

.capsule-textarea {
  width: 100%;
  border-radius: 12px;
  border: 2px solid #e0e0e0;
  padding: 16px;
  font-size: 15px;
  min-height: 120px;
  resize: vertical;
  transition: border-color 0.3s;
  font-family: inherit;
}

.capsule-textarea:focus {
  outline: none;
  border-color: #7ec6e6;
}

.char-count {
  text-align: right;
  font-size: 12px;
  color: #999;
}

.capsule-input {
  width: 100%;
  border-radius: 12px;
  border: 2px solid #e0e0e0;
  padding: 12px 16px;
  font-size: 15px;
  transition: border-color 0.3s;
}

.capsule-input:focus {
  outline: none;
  border-color: #7ec6e6;
}

.time-presets {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 8px;
}

.preset-btn {
  background: rgba(126,198,230,0.1);
  border: 1px solid rgba(126,198,230,0.3);
  color: #7ec6e6;
  border-radius: 20px;
  padding: 6px 12px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.3s;
}

.preset-btn:hover {
  background: rgba(126,198,230,0.2);
}

.preset-btn.active {
  background: #7ec6e6;
  color: white;
  border-color: #7ec6e6;
}

.capsule-select {
  width: 100%;
  border-radius: 12px;
  border: 2px solid #e0e0e0;
  padding: 12px 16px;
  font-size: 15px;
  transition: border-color 0.3s;
  background: white;
}

.capsule-select:focus {
  outline: none;
  border-color: #7ec6e6;
}

.file-upload-area {
  border: 2px dashed #e0e0e0;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  background: rgba(126,198,230,0.05);
}

.file-upload-area:hover {
  border-color: #7ec6e6;
  background: rgba(126,198,230,0.1);
}

.upload-placeholder {
  color: #666;
}

.upload-icon {
  font-size: 32px;
  margin-bottom: 8px;
}

.upload-hint {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
}

.file-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.file-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}

.file-name {
  font-size: 14px;
  color: #333;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.remove-btn {
  background: #ff4757;
  color: white;
  border: none;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 8px;
}

.file-input-hidden {
  display: none;
}

.capsule-btn {
  background: linear-gradient(90deg, #7ec6e6, #f7cac9);
  color: #fff;
  border: none;
  border-radius: 12px;
  padding: 14px 28px;
  font-size: 16px;
  font-weight: bold;
  box-shadow: 0 2px 8px rgba(126,198,230,0.15);
  cursor: pointer;
  transition: all 0.3s;
  margin-top: 10px;
}

.capsule-btn:hover:not(.disabled) {
  background: linear-gradient(90deg, #f7cac9, #7ec6e6);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(126,198,230,0.25);
}

.capsule-btn.disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.capsule-list-card {
  background: rgba(255,255,255,0.95);
  border-radius: 18px;
  box-shadow: 0 4px 16px rgba(126,198,230,0.10);
  padding: 24px 32px;
  width: 600px;
  max-width: 95vw;
  margin: 32px auto 0 auto;
}
.capsule-list-title {
  font-size: 20px;
  font-weight: bold;
  color: #7ec6e6;
  margin-bottom: 12px;
}
.capsule-empty {
  color: #aaa;
  text-align: center;
  padding: 24px 0;
}
.capsule-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.capsule-list-item {
  background: #f0f5f9;
  border-radius: 10px;
  padding: 12px 18px;
  box-shadow: 0 2px 8px rgba(126,198,230,0.06);
}
.capsule-list-content {
  font-size: 15px;
  color: #333;
  margin-bottom: 4px;
}
.capsule-list-time {
  font-size: 13px;
  color: #888;
}
</style> 