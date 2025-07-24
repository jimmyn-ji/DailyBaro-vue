<template>
  <div class="edit-bg">
    <div class="edit-card">
      <h2 class="edit-title">{{ isEdit ? '编辑日记' : '新增日记' }}</h2>
      <input v-model="title" class="edit-input" placeholder="标题" />
      <textarea v-model="content" class="edit-textarea" placeholder="写下你的心情..." />
      <div class="tags">
        <label v-for="tag in tags" :key="tag.tag_id" class="tag-label">
          <input type="checkbox" :value="tag.tag_name" v-model="selectedTags" />{{ tag.tag_name }}
        </label>
      </div>
      <input type="file" multiple @change="handleFileChange" class="file-input" />
      <div class="media-preview">
        <div v-for="file in mediaFiles" :key="file.name" class="media-item">
          <span>{{ file.name }}</span>
          <button class="remove-btn" @click="removeFile(file)">删除</button>
        </div>
      </div>
      <div class="btn-group">
        <button class="draft-btn" @click="saveDraft">保存草稿</button>
        <button class="publish-btn" @click="publish">发布</button>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import request from '@/utils/request'
const route = useRoute()
const router = useRouter()
const isEdit = !!route.params.id
const title = ref('')
const content = ref('')
const mediaFiles = ref([])
const tags = ref([])
const selectedTags = ref([])
function handleFileChange(e) { mediaFiles.value = Array.from(e.target.files) }
function removeFile(file) { mediaFiles.value = mediaFiles.value.filter(f => f !== file) }
async function loadTags() {
  try {
    const res = await request.get('/api/tag')
    tags.value = res.data.data || []
  } catch {
    tags.value = [ { tag_id: 1, tag_name: '开心' }, { tag_id: 2, tag_name: '难过' }, { tag_id: 3, tag_name: '压力' } ]
  }
}
async function loadDiary() {
  if (!isEdit) return
  const res = await request.get(`/api/diary/${route.params.id}`)
  const d = res.data.data
  title.value = d.title
  content.value = d.content
  selectedTags.value = d.tags ? d.tags.map(t => t.tag_name) : []
}
async function saveDiary(status) {
  const form = new FormData()
  form.append('title', title.value)
  form.append('content', content.value)
  selectedTags.value.forEach(t => form.append('tags', t))
  mediaFiles.value.forEach(f => form.append('mediaFiles', f))
  form.append('status', status)
  if (isEdit) {
    await request.put(`/api/diary/${route.params.id}`, form)
  } else {
    await request.post('/api/diary', form)
  }
  router.push('/user/diary')
}
function saveDraft() { saveDiary('draft') }
function publish() { saveDiary('published') }
onMounted(() => {
  loadTags()
  loadDiary()
})
</script>
<style scoped>
.edit-bg {
  min-height: 100vh;
  background: linear-gradient(135deg, #7ec6e6 0%, #f7cac9 100%);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 40px 0;
}
.edit-card {
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 8px 32px rgba(126,198,230,0.10);
  padding: 36px 32px 32px 32px;
  width: 600px;
  max-width: 95vw;
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.edit-title {
  font-size: 28px;
  font-weight: bold;
  color: #7ec6e6;
  margin-bottom: 10px;
  letter-spacing: 2px;
  text-align: center;
}
.edit-input {
  width: 100%;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  padding: 12px;
  font-size: 18px;
  margin-bottom: 10px;
}
.edit-textarea {
  width: 100%;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  padding: 12px;
  font-size: 16px;
  min-height: 120px;
  margin-bottom: 10px;
  resize: vertical;
}
.tags {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 10px;
}
.tag-label {
  background: #e0f0ff;
  color: #007aff;
  padding: 4px 14px;
  border-radius: 14px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}
.tag-label input {
  margin-right: 4px;
}
.file-input {
  margin-bottom: 10px;
}
.media-preview {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 10px;
}
.media-item {
  background: #f7fafc;
  border-radius: 8px;
  padding: 6px 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 2px 8px rgba(126,198,230,0.06);
}
.remove-btn {
  background: #ff4d4f;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 2px 10px;
  font-size: 13px;
  cursor: pointer;
}
.btn-group {
  display: flex;
  gap: 18px;
  justify-content: center;
  margin-top: 10px;
}
.draft-btn {
  background: #f0ad4e;
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 10px 28px;
  font-size: 16px;
  font-weight: bold;
  box-shadow: 0 2px 8px rgba(240,173,78,0.15);
  cursor: pointer;
  transition: background 0.2s;
}
.publish-btn {
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
.publish-btn:hover {
  background: linear-gradient(90deg, #f7cac9, #7ec6e6);
}
</style> 