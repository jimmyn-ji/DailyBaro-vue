<template>
  <div class="anonymous-planet">
    <h2>匿名星球</h2>
    <button @click="showPostInput = !showPostInput">发布动态</button>
    <div v-if="showPostInput" class="post-input">
      <textarea v-model="newContent" placeholder="说点什么..." />
      <select v-model="newVisibility">
        <option value="public">公开</option>
        <option value="friends">仅好友可见</option>
      </select>
      <button @click="publishPost">发布</button>
    </div>
    <div class="post-list">
      <div v-for="post in posts" :key="post.post_id" class="post-item" @click="goDetail(post.post_id)">
        <p>{{ post.content }}</p>
        <span>{{ post.create_time }}</span>
        <span>可见范围: {{ post.visibility }}</span>
        <button @click.stop="likePost(post)">点赞({{ post.likes || 0 }})</button>
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
.anonymous-planet { padding: 20px; }
.post-item { border-bottom: 1px solid #eee; padding: 10px 0; }
</style> 