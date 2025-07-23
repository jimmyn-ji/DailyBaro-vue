<template>
  <div class="diary-page">
    <h2>情绪日记本</h2>
    <!-- 标签筛选 -->
    <div class="tags">
      <span v-for="tag in tags" :key="tag.tag_id" @click="filterByTag(tag)">{{ tag.tag_name }}</span>
    </div>
    <!-- 日记列表 -->
    <div class="diary-list">
      <div v-for="diary in diaries" :key="diary.diary_id" class="diary-item" @click="goDetail(diary.diary_id)">
        <h3>{{ diary.title }}</h3>
        <p>{{ diary.content.substring(0, 50) }}...</p>
        <span>{{ diary.create_time }}</span>
      </div>
    </div>
    <button @click="goEdit()">新增日记</button>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import request from '@/utils/request'
const router = useRouter()
const diaries = ref([])
const tags = ref([])
const selectedTag = ref(null)

function goEdit() { router.push('/user/diary/edit') }
function goDetail(id) { router.push(`/user/diary/detail/${id}`) }

async function loadTags() {
  // 假设后端有 /api/tag，若无请调整
  const res = await request.get('/api/tag')
  tags.value = res.data.data || []
}

async function loadDiaries(tagId = null) {
  let params = {}
  if (tagId) params.tagId = tagId
  const res = await request.get('/api/diary', { params })
  diaries.value = res.data.data || []
}

function filterByTag(tag) {
  selectedTag.value = tag
  loadDiaries(tag.tag_id)
}

onMounted(() => {
  loadTags()
  loadDiaries()
})
</script>
<style scoped>
.diary-page { padding: 20px; }
.tags span { margin-right: 8px; cursor: pointer; }
.diary-item { border-bottom: 1px solid #eee; padding: 10px 0; cursor: pointer; }
</style> 