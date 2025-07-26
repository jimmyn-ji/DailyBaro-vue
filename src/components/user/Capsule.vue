<template>
  <div class="capsule-bg">
    <div class="capsule-card">
      <h2 class="capsule-title">创建情绪胶囊</h2>
      
      <div class="form-group">
        <label class="form-label">当前情绪</label>
        <div class="emotion-selector">
          <select v-model="currentEmotion" class="emotion-select">
            <option value="开心">😊 开心</option>
            <option value="难过">😢 难过</option>
            <option value="愤怒">😠 愤怒</option>
            <option value="焦虑">😰 焦虑</option>
            <option value="平静">😌 平静</option>
            <option value="兴奋">🤩 兴奋</option>
            <option value="疲惫">😴 疲惫</option>
            <option value="困惑">😕 困惑</option>
          </select>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">你的想法</label>
        <textarea 
          v-model="thoughts" 
          class="capsule-textarea" 
          placeholder="写下你此刻的想法—"
          maxlength="500"
        />
        <div class="char-count">{{ thoughts.length }}/500</div>
      </div>

      <div class="form-group">
        <label class="form-label">未来目标</label>
        <textarea 
          v-model="futureGoal" 
          class="capsule-textarea" 
          placeholder="写下你对未来的期望或目标—"
          maxlength="500"
        />
        <div class="char-count">{{ futureGoal.length }}/500</div>
      </div>

      <div class="form-group">
        <label class="form-label">添加媒体</label>
        <div class="file-upload-area" @click="triggerFileInput">
          <div v-if="mediaFiles.length === 0" class="upload-placeholder">
            <div class="upload-icon">📎</div>
            <p>点击下方按钮添加照片或录音</p>
          </div>
          <div v-else class="file-list">
            <div v-for="(file, index) in mediaFiles" :key="index" class="file-item">
              <span class="file-name">{{ file.name }}</span>
              <button @click="removeFile(index)" class="remove-btn">×</button>
            </div>
          </div>
        </div>
        <div class="upload-buttons">
          <button @click="triggerPhotoInput" class="upload-btn photo-btn">添加照片</button>
          <button @click="triggerAudioInput" class="upload-btn audio-btn">录制音频</button>
        </div>
        <input 
          ref="fileInput"
          type="file" 
          multiple 
          @change="handleFileChange" 
          class="file-input-hidden"
          accept="image/*,audio/*,video/*,.m4a,.aac,.ncm"
        />
        <input 
          ref="photoInput"
          type="file" 
          @change="handlePhotoChange" 
          class="file-input-hidden"
          accept="image/*"
        />
        <input 
          ref="audioInput"
          type="file" 
          @change="handleAudioChange" 
          class="file-input-hidden"
          accept="audio/*,.m4a,.aac,.ncm"
        />
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
        <div class="reminder-options">
          <label class="reminder-option">
            <input type="radio" v-model="reminderType" value="app_notification" />
            <span>应用内通知</span>
          </label>
          <label class="reminder-option">
            <input type="radio" v-model="reminderType" value="email" />
            <span>电子邮件</span>
          </label>
          <label class="reminder-option">
            <input type="radio" v-model="reminderType" value="sms" />
            <span>短信</span>
          </label>
        </div>
      </div>

      <button 
        class="capsule-btn" 
        @click="saveCapsule"
        :disabled="!isFormValid"
        :class="{ disabled: !isFormValid }"
      >
        {{ isSaving ? '保存中...' : '保存情绪胶囊' }}
      </button>
    </div>

    <div class="capsule-list-card">
      <h3 class="capsule-list-title">我的情绪胶囊</h3>
      <div v-if="capsuleList.length === 0" class="capsule-empty">暂无胶囊</div>
      <div v-else class="capsule-list">
        <div v-for="item in capsuleList" :key="item.capsuleId" class="capsule-list-item">
          <div class="capsule-item-header">
            <div class="capsule-emotion">
              <span class="emotion-emoji">{{ getEmotionEmoji(item.currentEmotion) }}</span>
              <span class="emotion-text">{{ item.currentEmotion || '开心' }}</span>
            </div>
            <div class="capsule-open-time">将在{{ formatTime(item.openTime) }}开启</div>
          </div>
          <div class="capsule-content">{{ item.content ? item.content.slice(0, 30) : '（无内容）' }}</div>
          <!-- 媒体文件展示区 -->
          <div v-if="item.media && item.media.length > 0 && !item.isOpened" class="media-preview">
            <div class="media-title">附件：</div>
            <div class="media-list">
              <div v-for="(media, idx) in item.media" :key="media.mediaId" class="media-item">
                <template v-if="getMediaType(media.mediaUrl) === 'image'">
                  <img :src="getFullUrl(media.mediaUrl)" style="max-width:120px;max-height:80px;" />
                </template>
                <template v-else-if="getMediaType(media.mediaUrl) === 'audio'">
                  <audio :src="getFullUrl(media.mediaUrl)" controls style="width:180px;" @error="handleAudioError"></audio>
                </template>
                <template v-else-if="getMediaType(media.mediaUrl) === 'video'">
                  <video :src="getFullUrl(media.mediaUrl)" controls style="max-width:180px;max-height:100px;" />
                </template>
                <!-- ncm文件现在作为audio类型处理，不需要other类型显示 -->
              </div>
            </div>
          </div>
          <div class="capsule-footer">
            <span class="capsule-create-time">创建于{{ formatDate(item.createTime) }}</span>
            <button @click="deleteCapsule(item.capsuleId)" class="delete-btn">删除</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import request from '@/utils/request'

const currentEmotion = ref('开心')
const thoughts = ref('')
const futureGoal = ref('')
const openTime = ref('')
const reminderType = ref('app_notification')
const mediaFiles = ref([])
const isSaving = ref(false)
const fileInput = ref(null)
const photoInput = ref(null)
const audioInput = ref(null)
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
  return thoughts.value.trim() && openTime.value
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

// 触发照片选择
function triggerPhotoInput() {
  photoInput.value.click()
}

// 触发音频选择
function triggerAudioInput() {
  audioInput.value.click()
}

// 处理文件选择
function handleFileChange(e) {
  const files = Array.from(e.target.files)
  addValidFiles(files)
  e.target.value = ''
}

// 处理照片选择
function handlePhotoChange(e) {
  const files = Array.from(e.target.files)
  addValidFiles(files)
  e.target.value = ''
}

// 处理音频选择
function handleAudioChange(e) {
  const files = Array.from(e.target.files)
  addValidFiles(files)
  e.target.value = ''
}

// 添加有效文件
function addValidFiles(files) {
  const validFiles = files.filter(file => {
    // 支持的文件类型
    const supportedTypes = [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/bmp',
      'audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/aac', 'audio/m4a', 'audio/nvm',
      'video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/flv'
    ]
    
    const isValid = supportedTypes.includes(file.type) || 
                   file.name.toLowerCase().endsWith('.m4a') ||
                   file.name.toLowerCase().endsWith('.aac') ||
                   file.name.toLowerCase().endsWith('.nvm') ||
                   file.name.toLowerCase().endsWith('.ncm')
    // 允许ncm格式
    if (!isValid) {
      ElMessage.warning(`不支持的文件类型: ${file.name}`)
    }
    return isValid
  })
  
  mediaFiles.value.push(...validFiles)
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
    form.append('currentEmotion', currentEmotion.value)
    form.append('thoughts', thoughts.value.trim())
    form.append('futureGoal', futureGoal.value.trim())
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
  currentEmotion.value = '开心'
  thoughts.value = ''
  futureGoal.value = ''
  openTime.value = ''
  reminderType.value = 'app_notification'
  mediaFiles.value = []
}

// 格式化时间
function formatTime(time) {
  if (!time) return ''
  const d = new Date(time)
  return d.toLocaleString()
}

// 格式化日期
function formatDate(time) {
  if (!time) return ''
  const d = new Date(time)
  return d.toLocaleDateString()
}

// 获取情绪对应的emoji
function getEmotionEmoji(emotion) {
  const emojiMap = {
    '开心': '😊',
    '难过': '😢',
    '愤怒': '😠',
    '焦虑': '😰',
    '平静': '😌',
    '兴奋': '🤩',
    '疲惫': '😴',
    '困惑': '😕'
  }
  return emojiMap[emotion] || '😊'
}

// 删除胶囊
async function deleteCapsule(capsuleId) {
  try {
    await request.delete(`/api/capsules/${capsuleId}`)
    ElMessage.success('删除成功')
    loadCapsuleList()
  } catch (error) {
    ElMessage.error('删除失败')
  }
}

// 加载胶囊列表
async function loadCapsuleList() {
  try {
    const res = await request.get('/api/capsules')
    if (res.data.code === 200) {
      capsuleList.value = res.data.data || []
    }
  } catch (e) {
    console.error('加载胶囊列表失败:', e)
  }
}

function getFullUrl(filePath) {
  if (!filePath) return ''
  if (filePath.startsWith('http')) return filePath
  return 'http://localhost:8081' + filePath
}
function handleAudioError(event) {
  event.target.style.display = 'none'
}

function getMediaType(filePath) {
  if (!filePath) return ''
  const lowerPath = filePath.toLowerCase()
  if (lowerPath.match(/\.(jpg|jpeg|png|gif|webp)$/)) return 'image'
  if (lowerPath.match(/\.(mp3|wav|ogg|aac|m4a|nvm|ncm)$/)) return 'audio' // 添加ncm支持在线播放
  if (lowerPath.match(/\.(mp4|avi|mov|wmv|flv)$/)) return 'video'
  return 'other'
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

.emotion-selector {
  position: relative;
}

.emotion-select {
  width: 100%;
  border-radius: 12px;
  border: 2px solid #e0e0e0;
  padding: 12px 16px;
  font-size: 15px;
  transition: border-color 0.3s;
  background: white;
  cursor: pointer;
}

.emotion-select:focus {
  outline: none;
  border-color: #7ec6e6;
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

.reminder-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.reminder-option {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 8px;
  transition: background-color 0.3s;
}

.reminder-option:hover {
  background-color: rgba(126,198,230,0.1);
}

.reminder-option input[type="radio"] {
  margin: 0;
}

.reminder-option span {
  font-size: 14px;
  color: #333;
}

.file-upload-area {
  border: 2px dashed #e0e0e0;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  background: rgba(126,198,230,0.05);
  margin-bottom: 12px;
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

.upload-buttons {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.upload-btn {
  border: 2px solid #7ec6e6;
  background: white;
  color: #7ec6e6;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
}

.upload-btn:hover {
  background: #7ec6e6;
  color: white;
}

.photo-btn {
  border-color: #7ec6e6;
  color: #7ec6e6;
}

.photo-btn:hover {
  background: #7ec6e6;
  color: white;
}

.audio-btn {
  border-color: #f7cac9;
  color: #f7cac9;
}

.audio-btn:hover {
  background: #f7cac9;
  color: white;
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
  padding: 16px;
  box-shadow: 0 2px 8px rgba(126,198,230,0.06);
}

.capsule-item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.capsule-emotion {
  display: flex;
  align-items: center;
  gap: 6px;
}

.emotion-emoji {
  font-size: 18px;
}

.emotion-text {
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

.capsule-open-time {
  font-size: 12px;
  color: #666;
}

.capsule-content {
  font-size: 15px;
  color: #333;
  margin-bottom: 8px;
  line-height: 1.4;
}

.capsule-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.capsule-create-time {
  font-size: 12px;
  color: #888;
}

.delete-btn {
  background: #ff4757;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 4px 8px;
  font-size: 12px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.delete-btn:hover {
  background: #e63946;
}

/* 新增样式 */
.media-preview {
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px dashed #ccc;
}

.media-title {
  font-size: 14px;
  color: #555;
  margin-bottom: 8px;
}

.media-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.media-item {
  border: 1px solid #eee;
  border-radius: 6px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f9f9f9;
  padding: 4px;
}

.media-item img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.media-item audio,
.media-item video {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}
</style> 