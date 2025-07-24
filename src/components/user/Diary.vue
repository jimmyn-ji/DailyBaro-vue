<template>
  <div class="diary-bg">
    <div class="diary-card">
      <h2 class="diary-title">情绪日记本</h2>
      <div class="tags">
        <span v-for="tag in tags" :key="tag.tag_id" @click="filterByTag(tag)" :class="{active: selectedTag && selectedTag.tag_id === tag.tag_id}">{{ tag.tag_name }}</span>
      </div>
      <div class="diary-list">
        <div v-for="diary in diaries" :key="diary.diary_id" class="diary-item" @click="goDetail(diary.diary_id)">
          <h3>{{ diary.title }}</h3>
          <p>{{ diary.content.substring(0, 50) }}...</p>
          <span class="diary-meta">{{ diary.create_time }}</span>
        </div>
      </div>
      <button class="add-btn" @click="goEdit()">新增日记</button>
    </div>
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
.diary-bg {
  min-height: 100vh;
  background: linear-gradient(135deg, #7ec6e6 0%, #f7cac9 100%);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 40px 0;
}
.diary-card {
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
.diary-title {
  font-size: 32px;
  font-weight: bold;
  color: #7ec6e6;
  margin-bottom: 10px;
  letter-spacing: 2px;
  text-align: center;
}
.tags {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 10px;
  justify-content: center;
}
.tags span {
  background: #e0f0ff;
  color: #007aff;
  padding: 4px 14px;
  border-radius: 14px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}
.tags span.active, .tags span:hover {
  background: linear-gradient(90deg, #7ec6e6, #f7cac9);
  color: #fff;
}
.diary-list {
  margin-bottom: 20px;
}
.diary-item {
  background: #f7fafc;
  border-radius: 10px;
  padding: 18px 16px;
  margin-bottom: 14px;
  box-shadow: 0 2px 8px rgba(126,198,230,0.06);
  cursor: pointer;
  transition: box-shadow 0.2s;
}
.diary-item:hover {
  box-shadow: 0 6px 18px rgba(126,198,230,0.13);
}
.diary-meta {
  font-size: 13px;
  color: #999;
  margin-top: 6px;
}
.add-btn {
  width: 100%;
  background: linear-gradient(90deg, #7ec6e6, #f7cac9);
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 14px 0;
  font-size: 18px;
  font-weight: bold;
  box-shadow: 0 2px 8px rgba(126,198,230,0.15);
  margin-top: 10px;
  cursor: pointer;
  transition: background 0.2s;
}
.add-btn:hover {
  background: linear-gradient(90deg, #f7cac9, #7ec6e6);
}
</style> 