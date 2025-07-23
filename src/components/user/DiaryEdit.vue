<template>
  <div class="diary-edit">
    <h2>{{ isEdit ? '编辑日记' : '新增日记' }}</h2>
    <input v-model="title" placeholder="标题" />
    <textarea v-model="content" placeholder="写下你的心情..." />
    <!-- 标签选择 -->
    <div class="tags">
      <label v-for="tag in tags" :key="tag.tag_id">
        <input type="checkbox" :value="tag.tag_name" v-model="selectedTags" />{{ tag.tag_name }}
      </label>
    </div>
    <!-- 多媒体上传 -->
    <input type="file" multiple @change="handleFileChange" />
    <div class="media-preview">
      <div v-for="file in mediaFiles" :key="file.name">
        <span>{{ file.name }}</span>
        <button @click="removeFile(file)">删除</button>
      </div>
    </div>
    <button @click="saveDraft">保存草稿</button>
    <button @click="publish">发布</button>
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
  // 假设后端有 /api/tag，若无请用静态标签
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
  // 多媒体回显略
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
.diary-edit { padding: 20px; }
.media-preview { margin: 10px 0; }
</style> 