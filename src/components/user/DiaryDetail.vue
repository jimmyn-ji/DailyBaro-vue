<template>
  <div class="detail-bg">
    <div class="detail-card">
      <h2 class="detail-title">{{ diary.title }}</h2>
      <div class="detail-meta">{{ diary.create_time }}</div>
      <div class="detail-content">{{ diary.content }}</div>
      <div class="media-list">
        <div v-for="media in diary.media" :key="media.media_id" class="media-item">
          <img v-if="media.media_type==='image'" :src="media.media_url" class="media-img" />
          <video v-else-if="media.media_type==='video'" :src="media.media_url" controls class="media-video" />
          <audio v-else-if="media.media_type==='audio'" :src="media.media_url" controls class="media-audio" />
        </div>
      </div>
      <div class="tags">
        <span v-for="tag in diary.tags" :key="tag.tag_id" class="tag">{{ tag.tag_name }}</span>
      </div>
      <button class="analysis-btn" @click="goAnalysis">情绪分析</button>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import request from '@/utils/request'
const route = useRoute()
const router = useRouter()
const diary = ref({ title: '', content: '', create_time: '', media: [], tags: [] })
async function loadDiary() {
  const res = await request.get(`/api/diary/${route.params.id}`)
  diary.value = res.data.data || { title: '', content: '', create_time: '', media: [], tags: [] }
}
function goAnalysis() { router.push('/user/analysis') }
onMounted(() => { loadDiary() })
</script>
<style scoped>
.detail-bg {
  min-height: 100vh;
  background: linear-gradient(135deg, #7ec6e6 0%, #f7cac9 100%);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 40px 0;
}
.detail-card {
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
.detail-title {
  font-size: 28px;
  font-weight: bold;
  color: #7ec6e6;
  margin-bottom: 10px;
  letter-spacing: 2px;
  text-align: center;
}
.detail-meta {
  font-size: 14px;
  color: #999;
  margin-bottom: 10px;
  text-align: center;
}
.detail-content {
  font-size: 16px;
  color: #333;
  margin-bottom: 10px;
  white-space: pre-line;
}
.media-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 10px;
}
.media-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.media-img {
  max-width: 200px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(126,198,230,0.10);
}
.media-video {
  max-width: 200px;
  border-radius: 8px;
  margin-top: 6px;
}
.media-audio {
  width: 200px;
  margin-top: 6px;
}
.tags {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 10px;
  justify-content: center;
}
.tag {
  background: #e0f0ff;
  color: #007aff;
  padding: 4px 14px;
  border-radius: 14px;
  font-size: 14px;
}
.analysis-btn {
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
.analysis-btn:hover {
  background: linear-gradient(90deg, #f7cac9, #7ec6e6);
}
</style> 