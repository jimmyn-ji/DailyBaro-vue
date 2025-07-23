<template>
  <div class="anonymous-post-detail">
    <h2>动态详情</h2>
    <div>{{ post.content }}</div>
    <div>{{ post.create_time }}</div>
    <div>可见范围: {{ post.visibility }}</div>
    <button @click="likePost">点赞({{ post.likes }})</button>
    <div class="comments">
      <div v-for="comment in post.comments" :key="comment.comment_id">
        <span>{{ comment.content }}</span>
        <span>{{ comment.create_time }}</span>
      </div>
      <input v-model="newComment" placeholder="写评论..." />
      <button @click="addComment">评论</button>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import request from '@/utils/request'
const route = useRoute()
const post = ref({ content: '', create_time: '', visibility: '', likes: 0, comments: [] })
const newComment = ref('')

async function loadPost() {
  const res = await request.get(`/api/anonymous-posts/${route.params.id}`)
  post.value = res.data.data || { content: '', create_time: '', visibility: '', likes: 0, comments: [] }
}

async function likePost() {
  await request.post(`/api/anonymous-posts/${route.params.id}/like`)
  loadPost()
}

async function addComment() {
  if (!newComment.value) return
  // 假设后端评论接口为 /post/insertPost，需传 postId、content
  await request.post('/post/insertPost', { postId: route.params.id, content: newComment.value })
  newComment.value = ''
  loadPost()
}

onMounted(() => { loadPost() })
</script>
<style scoped>
.anonymous-post-detail { padding: 20px; }
.comments { margin-top: 20px; }
</style> 