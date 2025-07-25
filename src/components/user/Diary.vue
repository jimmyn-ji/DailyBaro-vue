<template>
  <div class="diary-bg">
    <div class="diary-card">
      <el-tabs v-model="statusTab" @tab-click="onTabChange" class="diary-tabs">
        <el-tab-pane label="全部" name="all"></el-tab-pane>
        <el-tab-pane label="草稿箱" name="draft"></el-tab-pane>
        <el-tab-pane label="已发布" name="published"></el-tab-pane>
      </el-tabs>
      <div class="filter-bar">
        <el-date-picker
          v-model="selectedDate"
          type="date"
          placeholder="选择日期"
          clearable
          :editable="false"
          :close-on-select="true"
          @change="onDateChange"
          style="margin-right: 10px;"
        />
        <el-select
          v-model="selectedTag"
          placeholder="选择标签"
          clearable
          @change="onTagChange"
          style="width: 180px;"
        >
          <el-option
            v-for="tag in tags"
            :key="tag.tagId"
            :label="tag.tagName"
            :value="tag.tagId"
          />
        </el-select>
      </div>
      <div class="diary-list">
        <div v-if="Array.isArray(diaries) && diaries.length > 0">
          <div v-for="diary in diaries" :key="diary.diaryId" class="diary-item">
          <div class="diary-header">
            <h3>{{ diary.title }}</h3>
            <span v-if="diary.status === 'draft'" class="status-draft">[草稿]</span>
            <span v-else-if="diary.status === 'published'" class="status-published">[已发布]</span>
          </div>
          <div class="media-preview">
              <template v-for="media in getMediaList(diary)" :key="media && media.media_url">
                <img v-if="media && media.media_type==='image'" :src="media.media_url" class="media-thumb" />
                <video v-else-if="media && media.media_type==='video'" :src="media.media_url" controls class="media-thumb" />
                <audio v-else-if="media && media.media_type==='audio'" :src="media.media_url" controls class="media-thumb" />
              </template>
          </div>
          <p>{{ diary.content.substring(0, 50) }}...</p>
            <span class="diary-meta">{{ formatDate(diary.createTime) }}</span>
          <div class="diary-actions">
            <el-button size="small" @click="editDiary(diary)">编辑</el-button>
              <el-button size="small" type="danger" @click="deleteDiary(diary.diaryId)">删除</el-button>
            </div>
          </div>
        </div>
        <div v-else style="text-align:center;color:#bbb;padding:40px 0;">
          暂无日记
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
import { ElMessage, ElMessageBox } from 'element-plus'
import dayjs from 'dayjs'
const router = useRouter()
const diaries = ref([])
const tags = ref([])
const selectedTag = ref(null)
const selectedDate = ref(null)
const statusTab = ref('all')

function resetFiltersExceptTab() {
  selectedTag.value = null;
  selectedDate.value = null;
}

function goEdit() { router.push('/user/diary/edit') }
function editDiary(diary) { router.push(`/user/diary/edit/${diary.diaryId}`) }
async function loadTags() {
  const res = await request.get('/api/tag')
  tags.value = Array.isArray(res.data.data) ? res.data.data : []
  console.log('标签数据', tags.value)
}
async function loadDiaries() {
  try {
    const params = {};
    if (statusTab.value !== 'all') params.status = statusTab.value;
    if (selectedTag.value) params.tagIds = selectedTag.value; // 修复：不要用数组，直接用字符串
    if (selectedDate.value) params.date = dayjs(selectedDate.value).format('YYYY-MM-DD');
    const res = await request.get('/api/diary', { params });
    if (res.data.code === 200 && Array.isArray(res.data.data)) {
      diaries.value = res.data.data;
    } else {
      diaries.value = [];
    }
  } catch (e) {
    diaries.value = [];
  }
}
function onTabChange() {
  loadDiaries();
}
function onDateChange() {
  loadDiaries();
}
function onTagChange() {
  loadDiaries();
}
async function deleteDiary(id) {
  try {
    await ElMessageBox.confirm('确定要删除该日记吗？', '提示', { type: 'warning' })
    await request.delete(`/api/diary/${id}`)
    ElMessage.success('删除成功')
    loadDiaries()
  } catch {}
}
const getMediaList = (diary) => Array.isArray(diary && diary.media) ? diary.media : []
function formatDate(ts) {
  if (!ts) return '';
  const d = new Date(ts);
  return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0') + ' ' + String(d.getHours()).padStart(2,'0') + ':' + String(d.getMinutes()).padStart(2,'0');
}
onMounted(() => {
  loadTags();
  loadDiaries();
});
</script>
<style scoped>
.diary-bg {
  min-height: 100vh;
  background: transparent !important;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 20px 0;
}
.diary-card, .diary-item, .diary-list, .filter-bar, .diary-header, .diary-actions {
  background: transparent !important;
  box-shadow: none !important;
}
.diary-title {
  font-size: 32px;
  font-weight: bold;
  color: #7ec6e6;
  margin-bottom: 10px;
  letter-spacing: 2px;
  text-align: center;
}
.diary-tabs {
  margin-bottom: 10px;
}
.filter-bar {
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
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
  background: rgba(255,255,255,0.88);
  border-radius: 16px;
  padding: 16px 14px;
  margin-bottom: 14px;
  box-shadow: 0 2px 8px rgba(126,198,230,0.09);
  cursor: pointer;
  transition: box-shadow 0.2s;
  color: #222 !important;
}
.diary-item:hover {
  box-shadow: 0 6px 18px rgba(126,198,230,0.13);
}
.diary-header {
  display: flex;
  align-items: center;
  gap: 8px;
}
.status-draft {
  color: #f0ad4e;
  font-size: 14px;
}
.status-published {
  color: #67c23a;
  font-size: 14px;
}
.media-preview {
  display: flex;
  gap: 8px;
  margin-bottom: 6px;
}
.media-thumb {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 6px;
  box-shadow: 0 1px 4px rgba(126,198,230,0.10);
}
.diary-meta {
  font-size: 13px;
  color: #999;
  margin-top: 6px;
}
.diary-actions {
  margin-top: 6px;
  display: flex;
  gap: 10px;
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
