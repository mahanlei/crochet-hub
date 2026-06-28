<template>
  <div v-if="loading" class="text-center py-20 text-gray-400">加载中...</div>
  <div v-else-if="!work" class="text-center py-20 text-gray-400">作品不存在</div>

  <div v-else>
    <router-link to="/" class="inline-flex items-center text-sm text-gray-500 hover:text-pink-600 mb-4 transition">
      ← 返回列表
    </router-link>

    <div class="grid md:grid-cols-2 gap-6">
      <!-- 左侧：图片轮播 -->
      <ImageCarousel :images="allImages" />

      <!-- 右侧：作品信息 -->
      <div>
        <h1 class="text-2xl font-bold text-gray-800 mb-2">{{ work.title }}</h1>

        <div class="flex gap-2 mb-4">
          <span class="text-sm text-gray-500">{{ craftTypeMap[work.craft_type] || work.craft_type }}</span>
          <span class="text-sm text-pink-600">{{ difficultyMap[work.difficulty] || work.difficulty }}</span>
        </div>

        <p v-if="work.description" class="text-sm text-gray-600 mb-6 leading-relaxed">
          {{ work.description }}
        </p>

        <!-- 材料清单 -->
        <div v-if="work.materials?.length" class="mb-4">
          <h3 class="text-sm font-bold text-gray-700 mb-2">材料清单</h3>
          <div class="flex flex-wrap gap-1.5">
            <span v-for="(m, i) in work.materials" :key="i" class="text-xs bg-pink-50 text-pink-700 px-2 py-1 rounded">
              {{ m }}
            </span>
          </div>
        </div>

        <!-- 工具清单 -->
        <div v-if="work.tools?.length" class="mb-4">
          <h3 class="text-sm font-bold text-gray-700 mb-2">工具清单</h3>
          <div class="flex flex-wrap gap-1.5">
            <span v-for="(t, i) in work.tools" :key="i" class="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
              {{ t }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- 分步教程 -->
    <div class="mt-8">
      <StepList :steps="work.steps" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getWork, imgUrl } from '../services/api'
import ImageCarousel from '../components/ImageCarousel.vue'
import StepList from '../components/StepList.vue'

const route = useRoute()
const work = ref(null)
const loading = ref(true)

const difficultyMap = { beginner: '入门', intermediate: '中级', advanced: '高级' }
const craftTypeMap = { crochet: '🧶 钩针', knitting: '🪡 棒针' }

const allImages = computed(() => {
  if (!work.value) return []
  return [work.value.cover_image, ...(work.value.steps || []).map((s) => s.image)]
    .filter(Boolean)
    .map(imgUrl)
})

onMounted(() => {
  getWork(route.params.id)
    .then((res) => {
      if (res.success) work.value = res.data
    })
    .catch(console.error)
    .finally(() => { loading.value = false })
})
</script>
