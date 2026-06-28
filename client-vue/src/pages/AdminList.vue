<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-xl font-bold text-gray-800">作品管理</h1>
      <router-link
        to="/admin/new"
        class="bg-pink-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-pink-700 transition"
      >
        + 新建作品
      </router-link>
    </div>

    <div v-if="loading" class="text-center py-20 text-gray-400">加载中...</div>

    <div v-else-if="works.length === 0" class="text-center py-20 text-gray-400">
      <p class="mb-3">暂无作品</p>
      <router-link to="/admin/new" class="text-pink-600 hover:underline">创建第一个作品</router-link>
    </div>

    <div v-else class="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <!-- 桌面端：表格布局 -->
      <table class="w-full text-sm hidden sm:table">
        <thead class="bg-gray-50 text-gray-500">
          <tr>
            <th class="text-left px-4 py-3 font-medium">作品</th>
            <th class="text-left px-4 py-3 font-medium whitespace-nowrap">类别</th>
            <th class="text-left px-4 py-3 font-medium whitespace-nowrap">难度</th>
            <th class="text-left px-4 py-3 font-medium whitespace-nowrap">创建时间</th>
            <th class="text-right px-4 py-3 font-medium whitespace-nowrap">操作</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-50">
          <tr v-for="work in works" :key="work.id" class="hover:bg-gray-50 transition">
            <td class="px-4 py-3">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded bg-gray-100 overflow-hidden flex-shrink-0">
                  <img v-if="work.cover_image" :src="imgUrl(work.cover_image)" alt="" class="w-full h-full object-cover" />
                  <div v-else class="w-full h-full flex items-center justify-center text-gray-300">🧶</div>
                </div>
                <span class="font-medium text-gray-800 truncate max-w-[200px]">{{ work.title }}</span>
              </div>
            </td>
            <td class="px-4 py-3 text-gray-500 whitespace-nowrap">{{ craftTypeMap[work.craft_type] || work.craft_type }}</td>
            <td class="px-4 py-3 text-gray-500 whitespace-nowrap">{{ difficultyMap[work.difficulty] || work.difficulty }}</td>
            <td class="px-4 py-3 text-gray-400 whitespace-nowrap">{{ new Date(work.created_at).toLocaleDateString() }}</td>
            <td class="px-4 py-3 text-right whitespace-nowrap">
              <button @click="router.push(`/admin/edit/${work.id}`)" class="text-blue-600 hover:underline mr-3">编辑</button>
              <button @click="handleDelete(work.id, work.title)" class="text-red-500 hover:underline">删除</button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- 移动端：卡片布局 -->
      <div class="sm:hidden divide-y divide-gray-100">
        <div v-for="work in works" :key="work.id" class="p-4">
          <div class="flex items-center gap-3 mb-2">
            <div class="w-12 h-12 rounded bg-gray-100 overflow-hidden flex-shrink-0">
              <img v-if="work.cover_image" :src="imgUrl(work.cover_image)" alt="" class="w-full h-full object-cover" />
              <div v-else class="w-full h-full flex items-center justify-center text-gray-300">🧶</div>
            </div>
            <div class="min-w-0 flex-1">
              <div class="font-medium text-gray-800 truncate">{{ work.title }}</div>
              <div class="text-xs text-gray-400 mt-0.5">
                {{ craftTypeMap[work.craft_type] || work.craft_type }}
                <span class="mx-1">·</span>
                {{ difficultyMap[work.difficulty] || work.difficulty }}
                <span class="mx-1">·</span>
                {{ new Date(work.created_at).toLocaleDateString() }}
              </div>
            </div>
          </div>
          <div class="flex justify-end gap-4 text-sm">
            <button @click="router.push(`/admin/edit/${work.id}`)" class="text-blue-600 hover:underline">编辑</button>
            <button @click="handleDelete(work.id, work.title)" class="text-red-500 hover:underline">删除</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getWorks, deleteWork, imgUrl } from '../services/api'

const router = useRouter()
const works = ref([])
const loading = ref(true)

const craftTypeMap = { crochet: '钩针', knitting: '棒针' }
const difficultyMap = { beginner: '入门', intermediate: '中级', advanced: '高级' }

const loadWorks = () => {
  loading.value = true
  getWorks()
    .then((res) => { if (res.success) works.value = res.data })
    .catch(console.error)
    .finally(() => { loading.value = false })
}

onMounted(loadWorks)

const handleDelete = async (id, title) => {
  if (!window.confirm(`确定删除「${title}」？`)) return
  try {
    const res = await deleteWork(id)
    if (res.success) loadWorks()
  } catch {
    alert('删除失败')
  }
}
</script>
