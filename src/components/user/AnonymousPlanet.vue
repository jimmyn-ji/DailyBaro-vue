<template>
  <div class="planet-bg">
    <div class="planet-card">
      <h2 class="planet-title">匿名星球</h2>
      <button class="post-btn" @click="showPostInput = !showPostInput">发布动态</button>
      <div v-if="showPostInput" class="post-input">
        <textarea v-model="newContent" class="post-textarea" placeholder="说点什么..." />
        <select v-model="newVisibility" class="post-select">
          <option value="public">公开</option>
          <option value="friends">仅好友可见</option>
        </select>
        <button class="publish-btn" @click="publishPost">发布</button>
      </div>
      <div class="post-list">
        <div v-for="post in posts" :key="post.post_id" class="post-item" @click="goDetail(post.post_id)">
          <p>{{ post.content }}</p>
          <span class="post-meta">{{ post.create_time }}</span>
          <span class="post-meta">可见范围: {{ post.visibility }}</span>
          <button class="like-btn" @click.stop="likePost(post)">点赞({{ post.likes || 0 }})</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import request from '@/utils/request'
const router = useRouter()
const posts = ref([])
const showPostInput = ref(false)
const newContent = ref('')
const newVisibility = ref('public')
async function loadPosts() {
  const res = await request.get('/api/anonymous-posts')
  posts.value = res.data.data || []
}
async function likePost(post) {
  await request.post(`/api/anonymous-posts/${post.post_id}/like`)
  loadPosts()
}
function goDetail(id) { router.push(`/user/planet/detail/${id}`) }
async function publishPost() {
  if (!newContent.value) return
  await request.post('/api/anonymous-posts', { content: newContent.value, visibility: newVisibility.value })
  newContent.value = ''
  newVisibility.value = 'public'
  showPostInput.value = false
  loadPosts()
}
onMounted(() => { loadPosts() })
</script>
<style scoped>
.planet-bg {
  min-height: 100vh;
  background: linear-gradient(135deg, #7ec6e6 0%, #f7cac9 100%);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 40px 0;
}
.planet-card {
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
.planet-title {
  font-size: 28px;
  font-weight: bold;
  color: #7ec6e6;
  margin-bottom: 10px;
  letter-spacing: 2px;
  text-align: center;
}
.post-btn {
  background: linear-gradient(90deg, #7ec6e6, #f7cac9);
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 10px 28px;
  font-size: 16px;
  font-weight: bold;
  box-shadow: 0 2px 8px rgba(126,198,230,0.15);
  margin-bottom: 10px;
  cursor: pointer;
  transition: background 0.2s;
}
.post-btn:hover {
  background: linear-gradient(90deg, #f7cac9, #7ec6e6);
}
.post-input {
  display: flex;
  gap: 10px;
  align-items: center;
  margin-bottom: 10px;
}
.post-textarea {
  flex: 1;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  padding: 10px;
  font-size: 15px;
  min-height: 40px;
}
.post-select {
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  padding: 6px 10px;
  font-size: 15px;
}
.publish-btn {
  background: #7ec6e6;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 8px 18px;
  font-size: 15px;
  font-weight: bold;
  box-shadow: 0 2px 8px rgba(126,198,230,0.10);
  cursor: pointer;
}
.post-list {
  margin-top: 10px;
}
.post-item {
  background: #f7fafc;
  border-radius: 10px;
  padding: 18px 16px;
  margin-bottom: 14px;
  box-shadow: 0 2px 8px rgba(126,198,230,0.06);
  cursor: pointer;
  transition: box-shadow 0.2s;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.post-item:hover {
  box-shadow: 0 6px 18px rgba(126,198,230,0.13);
}
.post-meta {
  font-size: 13px;
  color: #999;
  margin-right: 10px;
}
.like-btn {
  background: #f0ad4e;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 4px 14px;
  font-size: 14px;
  font-weight: bold;
  box-shadow: 0 2px 8px rgba(240,173,78,0.10);
  cursor: pointer;
  align-self: flex-start;
}
</style> 