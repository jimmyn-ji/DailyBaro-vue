<template>
  <div class="diary-detail">
    <h2>{{ diary.title }}</h2>
    <div>{{ diary.create_time }}</div>
    <div>{{ diary.content }}</div>
    <!-- 多媒体展示 -->
    <div class="media-list">
      <div v-for="media in diary.media" :key="media.media_id">
        <img v-if="media.media_type==='image'" :src="media.media_url" style="max-width:200px;" />
        <video v-else-if="media.media_type==='video'" :src="media.media_url" controls style="max-width:200px;" />
        <audio v-else-if="media.media_type==='audio'" :src="media.media_url" controls />
      </div>
    </div>
    <!-- 标签 -->
    <div class="tags">
      <span v-for="tag in diary.tags" :key="tag.tag_id">{{ tag.tag_name }}</span>
    </div>
    <button @click="goAnalysis">情绪分析</button>
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
.diary-detail { padding: 20px; }
.media-list { margin: 10px 0; }
.tags span { margin-right: 8px; }
</style> 